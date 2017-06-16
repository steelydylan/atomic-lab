import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Menu, MenuItem, Tooltip, Icon } from 'react-mdl';
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
      showAtom:true,
      showMolecule:true,
      showOrganism:true,
      showTemplate:true,
      search:''
    };
  }

  selectItem(itemId) {
    this.props.selectItem(itemId);
  }

  getPackage() {
    return `{
      "name": "atomic-lab",
      "version": "1.0.0",
      "description": "static html generator based on atomic design",
      "scripts" : {
        "styleguide": "atomic-lab build"
      },
      "devDependencies":{
        "atomic-lab":"1.0.0"
      },
      "author": "steelaxe",
      "license": "MIT"
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
    zip.file("setting.json", JSON.stringify({
      components: comps
    }));
    comps.forEach(function(comp) {
      const file1 = "components/" + comp.category + "/" + comp.name + "/" + comp.name + "." + config.markup;
      const file2 = "components/" + comp.category + "/" + comp.name + "/" + comp.name + "." + config.styling;
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

  render() {
    const state = this.state;
    const collectionsReverse = [];
    const components = this.props.components || [];
    const id = this.props.itemId;
    const config = this.props.config;
    return (
      <div className="atomicLabSideMenu">
        <div className="atomicLabProjectControl">
          <div className="atomicLabProjectControl-title">
            {state.use_url_shortener ?
              <i className="material-icons atomicLabProjectControl-arrow">arrow_drop_down</i>
              :
              null}
          </div>
          <div className="atomicLabProjectDropdown js-dropdown<!-- BEGIN projectOnDrop:touch#true --> js-open<!-- END projectOnDrop:touch#true -->">
            <ul className="atomicLabProjectDropdown-list">
              {collectionsReverse.map(item => {
                <li><a href="{shortenedUrl}"><i className="material-icons">folder</i> {state.projectName}</a></li>
              })}
            </ul>
            <span className="atomicLabProjectDropdown-newProject" data-action="makeNewProject()"><a href="#">+ Make a new project</a></span>
          </div>
          <p className="atomicLabProjectControl-shotDescription <!-- BEGIN projectDescOnEdit:touch#true -->is-editing<!-- END projectDescOnEdit:touch#true -->">
            <span data-action="editProjectDesc()">
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
            </ul>
          </nav>
        </div>
        <div className="atomicLabComponentList">
          <ul>
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
