import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Menu, MenuItem, 
  Tooltip, Icon, Button, 
  DataTable, TableHeader 
} from 'react-mdl';
import classNames from 'classnames';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

import './sidemenu.scss';


const SidemenuItem = ({parent, item, id}) => {
  return (
  <li className={classNames("atomicLabComponentList-item", { "selected": item.itemId === id })} onClick={parent.selectItem.bind(parent, item.itemId)}>
    <span><i className="material-icons">insert_drive_file</i>
      {item.name}
    </span>
  </li>);
}

export default class ProjectDialog extends React.Component {

  constructor() {
    super();
    this.state = {
      showVariable:false,
      showMixin:false,
      showAtom:true,
      showMolecule:true,
      showOrganism:true,
      showTemplate:true,
      search:'',
      isConfingDialogOpen:false
    };
  }

  selectItem(itemId) {
    location.hash = `${itemId}`;
    this.props.selectItem(itemId);
  }

  getPackage() {
    return `{
  "name": "styleguide",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "watch": "onchange \\"components/\\" -- npm run build",
    "sync": "browser-sync start --server './' --files './styleguide/components.json' --startPath ./styleguide/index.html",
    "build": "npm-run-all -p build:guide",
    "build:guide": "atomic-lab build --markup html",
    "start": "npm-run-all -p watch sync"
  },
  "author": "steelydylan",
  "license": "MIT",
  "devDependencies": {
    "atomic-lab": "^1.3.4",
    "browser-sync": "^2.18.12",
    "node-sass": "^4.5.3",
    "npm-run-all": "^4.0.2",
    "onchange": "^3.2.1"
  }
}`;
  }

  getCategorizedItems(components, category) {
    const search = this.state.search;
    return components
      .sort(function(a, b) {
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      })
      .filter(function(comp) {
        if (comp.category !== category) {
          return false;
        }
        return comp.name.indexOf(search) >= 0;
      });
  }

  exportAsZip() {
    const zip = new JSZip();
    const comps = this.props.components;
    const config = this.props.config;
    comps.forEach(function(comp) {
      if(!comp.name){
        return;
      }
      const file1 = `components/${comp.name}/${comp.name}.${config.markup}`;
      const file2 = `components/${comp.name}/${comp.name}.${config.styling}`;
      zip.file(file1, comp.html);
      zip.file(file2, comp.css);
    });
    zip.file("package.json", this.getPackage());
    zip.generateAsync({
      type: "blob"
    }).then((content) => {
      FileSaver.saveAs(content, "atomic-lab.zip");
    })
  }

  searchComponent() {
    const search = ReactDOM.findDOMNode(this.refs.search);
    const value = search.value;
    this.setState({
        search:value
    });
  }

  toggleCategory(category) {
    const value = this.state[category];
    this.setState({
      [category]: !value
    });
  }

  openConfigDialog() {
    this.setState({
      isConfigDialogOpen:true
    });
  }

  closeConfigDialog() {
    this.setState({
      isConfigDialogOpen:false
    });
  }

  render() {
    const state = this.state;
    const components = this.props.components || [];
    const id = this.props.itemId;
    const config = this.props.config;
    const props = this.props;
    const lang = props && props.config && props.config.lang ? props.config.lang : 'ja';

    return (
      <div className="atomicLabSideMenu">
        <Dialog open={this.state.isConfigDialogOpen}>
          <DialogTitle>config.json</DialogTitle>
          <DialogContent>
            <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp" style={{tableLayout:'fixed'}}>
              <tr>
                <td>Lang</td>
                <td>{config.lang}</td>
              </tr>
              <tr>
                <td>CSS</td>
                <td>{config.styling}</td>
              </tr>
              <tr>
                <td>HTML</td>
                <td>{config.markup}</td>
              </tr>
              <tr>
                <td>File Path</td>
                <td><code>{config.local_file_path}</code></td>
              </tr>
              <tr>
                <td>Allow Executing JavaScript</td>
                <td>{config.run_script === true ? 'true' : 'false'}</td>
              </tr>
              <tr>
                <td>Allow Browser Editing</td>
                <td>{config.enable_editing === true ? 'true' : 'false'}</td>
              </tr>
              <tr>
                <th colSpan="2">CSS Dependencies</th>
              </tr>
              <tr>
                <td colSpan="2">
                  <ul style={{whiteSpace:'normal'}}>
                    {config.css_dependencies ? config.css_dependencies.map(item => <li>{item}</li>) : null}
                  </ul>
                </td>
              </tr>
            </table>
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={this.closeConfigDialog.bind(this)}>Close</Button>
          </DialogActions>
        </Dialog>
        <div className="atomicLabProjectControl">
          <p className="atomicLabProjectControl-shotDescription <!-- BEGIN projectDescOnEdit:touch#true -->is-editing<!-- END projectDescOnEdit:touch#true -->">
            <span>
              {config.description}
            </span>   
          </p>
          <nav className="atomicLabProjectControl-actions">
            <ul>
              <li onClick={this.exportAsZip.bind(this)}>
                <Tooltip label="Download this project as zip (included Export JSON data)" position="bottom">
                  <Icon name="file_download" />
                </Tooltip>
              </li>
              <li onClick={this.openConfigDialog.bind(this)}>
                <Tooltip label="Open config dialog" position="bottom">
                  <Icon name="list" />
                </Tooltip>
              </li>
            </ul>
          </nav>
        </div>
        <div className="atomicLabComponentList">
          <ul>
            <li className={classNames("atomicLabComponentList-category","_variable",{"js-closed":!state.showVariable})}>
              <span onClick={this.toggleCategory.bind(this,'showVariable')}>Variable
                <i className="material-icons">{state.showVariable ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
              </span>
              <ul>
                {this.getCategorizedItems(components,'variable').map(item =>
                  <SidemenuItem parent={this} item={item} id={id} />
                )}
              </ul>
            </li>
            <li className={classNames("atomicLabComponentList-category","_mixin",{"js-closed":!state.showMixin})}>
              <span onClick={this.toggleCategory.bind(this,'showMixin')}>Mixin
                <i className="material-icons">{state.showMixin ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
              </span>
              <ul>
                {this.getCategorizedItems(components,'mixin').map(item =>
                  <SidemenuItem parent={this} item={item} id={id} />
                )}
              </ul>
            </li>
            <li className={classNames("atomicLabComponentList-category","_atom",{"js-closed":!state.showAtom})}>
              <span onClick={this.toggleCategory.bind(this,'showAtom')}><div className="atomicLabComponentList-category-icon atom"></div>Atom
                <i className="material-icons">{state.showAtom ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
              </span>
              <ul>
                {this.getCategorizedItems(components,'atom').map(item =>
                  <SidemenuItem parent={this} item={item} id={id} />
                )}
              </ul>
            </li>
            <li className={classNames("atomicLabComponentList-category","_molecule",{"js-closed":!state.showMolecule})}>
              <span onClick={this.toggleCategory.bind(this,'showMolecule')}><div className="atomicLabComponentList-category-icon molecule"></div>Molecule
                <i className="material-icons">{state.showMolecule ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
              </span>
              <ul>
                {this.getCategorizedItems(components,'molecule').map(item =>
                  <SidemenuItem parent={this} item={item} id={id} />
                )}
              </ul>
            </li>
            <li className={classNames("atomicLabComponentList-category","_organism",{"js-closed":!state.showOrganism})}>
              <span onClick={this.toggleCategory.bind(this,'showOrganism')}><div className="atomicLabComponentList-category-icon organism"></div>Organism
                <i className="material-icons">{state.showOrganism ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
              </span>
              <ul>
                {this.getCategorizedItems(components,'organism').map(item =>
                  <SidemenuItem parent={this} item={item} id={id} />
                )}
              </ul>
            </li>
            <li className={classNames("atomicLabComponentList-category","_template",{"js-closed":!state.showTemplate})}>
              <span onClick={this.toggleCategory.bind(this,'showTemplate')}><div className="atomicLabComponentList-category-icon template"></div>Template
                <i className="material-icons">{state.showTemplate ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
              </span>
              <ul>
                {this.getCategorizedItems(components,'template').map(item =>
                  <SidemenuItem parent={this} item={item} id={id} />
                )}
              </ul>
            </li>
          </ul>
        </div>
        <div id="mask-search-cancel"></div>
        <div className="atomicLabSearchBox">
          <div className="atomicLabSearchBox-floatingCard">
            <div className="atomicLabSearchBox-main">
              <i className="material-icons">search</i>
              <input className="atomicLabSearchBox-input" type="text" placeholder="Search" onInput={this.searchComponent.bind(this)} ref="search" />
            </div>
          </div>
        </div>
      </div>);
  }
}
