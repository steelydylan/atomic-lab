import React, { Component, PropTypes } from 'react';
import SplitPane from 'react-split-pane';
import { Menu, MenuItem, Tooltip, Icon } from 'react-mdl';
import { Snackbar } from 'react-mdl';
import AceEditor from 'react-ace';
import brace from 'brace';
import classNames from 'classnames';
import Markdown from 'react-remarkable';
import Frame from 'react-frame-component';
import hljs from 'highlight.js';

import 'react-resizable/css/styles.css';
import 'highlight.js/styles/default.css';
import 'highlight.js/styles/tomorrow.css';
import './mainarea.scss';

import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/theme/monokai';

import Parser from '../../lib/parser.js';
import compiler from '../../lib/compiler.js';
import normalize from '../../lib/normalize.js';

import AddBtn from '../addbtn/addbtn';
import EditDialog from '../edit-dialog/edit-dialog';

const option = {
  html: false,        // Enable HTML tags in source
  xhtmlOut: false,        // Use '/' to close single tags (<br />)
  breaks: false,        // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-',  // CSS language prefix for fenced blocks
  linkify: true,         // autoconvert URL-like texts to links
  linkTarget: '',           // set target to open link in

  // Enable some language-neutral replacements + quotes beautification
  typographer: false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if input not changed
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) { }
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (__) { }

    return ''; // use external default escaping
  }
}

const material = {
  atom: 0,
  molecule: 1,
  organism: 2,
  template: 3
};

export default class MainArea extends React.Component {

  constructor() {
    super();
    this.state = {
      editMode: "preview",
      hasPreview: false,
      hasNote: false,
      isRemoveDialogOpen: false,
      isEditDialogOpen: false,
      isSnackbarActive: false
    };
  }

  changeMode(mode) {
    this.setState({
      editMode: mode
    });
  }

  componentWillReceiveProps(props) {
    if (props.config && props.config.parser) {
      const parser = new Parser(props.config.parser);
      this.parser = parser;
    }
  }

  getComponent() {
    const itemId = this.props.itemId;
    const components = this.props.components;
    let comp = null;
    if (itemId && components) {
      for (let i = 0, n = components.length; i < n; i++) {
        if (components[i].itemId === itemId) {
          comp = components[i];
        }
      }
    }
    return comp;
  }

  getComponentIndex() {
    const itemId = this.props.itemId;
    const components = this.props.components;
    let index = -1;
    if (itemId && components) {
      for (let i = 0, n = components.length; i < n; i++) {
        if (components[i].itemId === itemId) {
          index = i;
        }
      }
    }
    return index;   
  }

  isParsable() {
    const component = this.getComponent();
    if (!component || !this.parser) {
      return false;
    }
    return true;
  }

  getDescription() {
    if (!this.isParsable()) {
      return;
    }
    const component = this.getComponent();
    const doc = this.parser.getDoc(component.html);
    const desc = this.parser.getMark("desc", doc);
    return desc;
  }

  getNote() {
    if (!this.isParsable()) {
      return;
    }
    const component = this.getComponent();
    const note = this.parser.getNote(component.html);
    return note;
  }

  isGreaterThan(text) {
    const component = this.getComponent();
    const cat = component.category;
    if (material[cat] > material[text]) {
      return true;
    } else {
      return false;
    }
  }

  openEditDialog() {
    this.setState({
      isEditDialogOpen:true
    })
  }

  closeEditDialog() {
    this.setState({
      isEditDialogOpen:false
    });
  }

  getPreview() {
    if (!this.isParsable()) {
      return;
    }
    const config = this.props.config;
    const itemId = this.props.itemId;
    const parser = this.parser;
    const component = this.getComponent();
    const text = component.html;
    const components = this.props.components.sort((item_a,item_b) => {
      if(material[item_a.category] > material[item_b.category] ) {
        return 1;
      }
      return -1;
    });
    //textからpreview取得
    let preview = parser.getPreview(text);
    if(!preview) {
      return '';
    }
    preview = compiler.markup[config.markup](preview);
    //previewからコメント文取得
    let imports = "" + parser.getImports(text);
    // テンプレート取得
    while (1) {
      const comment = parser.getTag(preview, components);
      if (!comment) {
        break;
      }
      //commentからコンポーネント名取得
      const name = parser.getComponentName(comment);
      let flag = false;
      for (let i = 0, n = components.length; i < n; i++) {
        const comp = components[i];
        if (name == comp.name) {
          flag = true;
          //例えば、atomはmoleculeをincludeできない
          imports += parser.getImports(comp.html);
          if (itemId !== comp.itemId && !this.isGreaterThan(comp.category)) {
            preview = preview.replace(comment, "");
            break;
          }
          // importされてなければ使えない
          if (itemId !== comp.itemId && imports.indexOf(name) == -1) {
            preview = preview.replace(comment, "");
            break;
          }
          const template = parser.getTemplate(comp.html);
          let html = parser.getInnerHtmlFromTemplate(template);
          //templateに自身が含まれていたら削除(無限ループ回避)
          html = parser.removeSelf(html, comp.name);
          const defs = parser.getVarsFromTemplate(template);
          const overrides = parser.getVars(comment);
          html = parser.getRendered(html, defs, overrides);
          preview = preview.replace(comment, compiler.markup[config.markup](html));
          // preview = preview.replace(comment, html);
          break;
        }
      }
      if (!flag) {
        preview = preview.replace(comment, "");
      }
    }
    //スタイルシート取得
		let css = '';
    for (let i = 0, n = components.length; i < n; i++) {
      const comp = components[i];
      if (imports.indexOf(comp.name) !== -1 || itemId === comp.itemId) {
        css += comp.css;
      }
    }
   
    css += compiler.styling[config.styling](css);
    if(css) {
      css += `${normalize}`;
      preview += `<style>${css}\n*{box-sizing:border-box;}</style>`;
    }
    if(config.run_script){
      return preview;
    }else{
      return parser.removeScript(preview);
    }
  }

  openRemoveDialog() {
    this.setState({
      isRemoveDialogOpen:true
    })
  }

  removeItem() {
    const index = this.getComponentIndex();
    this.props.removeComponent(index);
  }

  aceOnload(editor) {
    editor.commands.addCommand({
      name: "save",
      bindKey: {
        win: "Ctrl+S",
        mac: "Command-S"
      },
      exec: () => {
        const value = editor.getSession().getValue();
        const currentItem = this.getComponent();
        const mode = this.state.editMode;
        const component = Object.assign({},currentItem,{[mode]:value});
        const index = this.getComponentIndex();
        this.props.updateComponent(index,component);
        this.setState({
          isSnackbarActive:true
        })
      }
    });
    editor.commands.on("exec", function(e) {
      if (e.command && (e.command.name == "reload" || e.command.name == "save")) {
        e.preventDefault();
        e.command.exec();
      }
    });
  }

  updateComponent(obj) {
    const currentItem = this.getComponent();
    const index = this.getComponentIndex();
    const component = Object.assign({},currentItem,obj);
    this.props.updateComponent(index,component);
  }

  hideSnackbar(){
    this.setState({
      isSnackbarActive:false
    });
  }

  render() {
    const state = this.state;
    const editMode = state.editMode;
    const hasPreview = state.hasPreview;
    const component = this.getComponent();
    const index = this.getComponentIndex();
    const description = this.getDescription();
    const note = this.getNote();
    const preview = this.getPreview();
    const props = this.props;
    const enable_editing = props.config && props.config.enable_editing;
    const isEditDialogOpen = state.isEditDialogOpen;
    const lang = 'ja';

    return (
      <main className="atomicLabMain">
        <div className="atomicLabTabs mdl-tabs mdl-js-tabs">
          <div className="atomicLabComponentControl mdl-shadow--2dp">
            {enable_editing ?
              <div className="atomicLabComponentControl-actions">
                <nav>
                  <ul>
                    <li>
                      <Tooltip label="Edit component settings" position="bottom">
                        <Icon name="edit" onClick={this.openEditDialog.bind(this)}/>
                      </Tooltip>
                    </li>
                    <li style={{position:'relative'}}>
                      <Tooltip label="Delete" position="bottom" id="componentAction-delete">
                        <Icon name="delete" className='_danger'/>
                      </Tooltip>
                      <Menu target="componentAction-delete" align="right">
                        <MenuItem disabled>Do you really want?</MenuItem>
                        <MenuItem className="mdl-menu__item">Cancel</MenuItem>
                        <MenuItem className="mdl-menu__item _danger" onClick={this.removeItem.bind(this)}>DELETE</MenuItem>
                      </Menu>
                    </li>
                  </ul>
                </nav>
              </div>
              :
              null}
            <div className="atomicLabComponentControl-icon">
              <img src="./images/iconAtom-l.png" alt="" />
            </div>
            <div className="atomicLabComponentControl-texts">
              <div className="atomicLabComponentControl-title">
                {component ?
                  <span>{component.name}</span>
                  : null
                }
              </div>
              <p className="atomicLabComponentControl-description">
                {description}
              </p>
            </div>
            {enable_editing ?
              <div className="atomicLabTabs-bar mdl-tabs__tab-bar">
                <a className={classNames("atomicLabTabs-tab", "mdl-layout__tab", { "is-active": editMode === "preview" })} onClick={this.changeMode.bind(this, 'preview')}>Preview</a>
                <a className={classNames("atomicLabTabs-tab", "mdl-layout__tab", { "is-active": editMode === "html" })} onClick={this.changeMode.bind(this, 'html')}>HTML</a>
                <a className={classNames("atomicLabTabs-tab", "mdl-layout__tab", { "is-active": editMode === "css" })} onClick={this.changeMode.bind(this, 'css')}>CSS</a>
              </div>
              :
              null}
          </div>
          {editMode === 'css' ?
            <div className="atomicLabTabs-panel mdl-tabs__panel is-active">
              {component ?
                <AceEditor value={component.css} mode='css' theme="monokai"
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                  }} onLoad={this.aceOnload.bind(this)}/>
                :
                null}
            </div>
            :
            null}
          {editMode === 'html' ?
            <div className="atomicLabTabs-panel mdl-tabs__panel is-active">
              {component ?
                <AceEditor value={component.html} mode='html' theme="monokai"
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                  }} onLoad={this.aceOnload.bind(this)}/>
                :
                null}
            </div>
            :
            null}
          {editMode === 'preview' ?
            <div className="atomicLabTabs-panel mdl-tabs__panel is-active">
              <div className="atomicLabPreview">
                {preview ?
                  <div className="atomicLabCard mdl-card mdl-shadow--2dp">
                    <div className="atomicLabCard-title"><i className="material-icons">visibility</i> Preview</div>
                      <SplitPane split="vertical" minSize={320} defaultSize="calc(100% - 10px)">
                        <div>
                          <Frame style={{width:'100%',height:'500px'}}>
                            <div dangerouslySetInnerHTML={{__html: preview}}>
                            </div>
                          </Frame>
                        </div>
                        <div>
                        </div>
                      </SplitPane>
                  </div>
                  :
                  null}
                {note ?
                  <div className="atomicLabCard mdl-card mdl-shadow--2dp">
                    <div className="atomicLabCard-title"><i className="material-icons">insert_drive_file</i> Note</div>
                    <div className="atomicLabNote"><Markdown source={note} options={option} /></div>
                  </div>
                  :
                  null}
              </div>
            </div>
            :
            null}
          {enable_editing ?
            <AddBtn {...props} />
            :
            null}
          {state.isEditDialogOpen ?
            <EditDialog 
              category={component.category} 
              name={component.name} 
              updateComponent={this.props.updateComponent} 
              index={index} 
              component={component}
              onClose={this.closeEditDialog.bind(this)}/>
            :
            null}
        </div>
        <Snackbar
          active={state.isSnackbarActive}
          onTimeout={this.hideSnackbar.bind(this)}
          action="Undo" onClick={this.hideSnackbar.bind(this)} timeout={2000}>Saved.</Snackbar>
      </main>
    );
  }
}
