import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Textfield, RadioGroup, Radio } from 'react-mdl';
import './addbtn.scss';

const defaultHtml = 
`<!--@doc
# @category atom
# @name aaa
# @css ./aaa.sass
-->
<!--@template-->
<!--@/template-->
<!--@preview
-->
<!--@note
# About aaa
-->`;

export default class AddBtn extends React.Component {

  constructor() {
    super();
    this.state = {
      isOpen:false,
      isDialogOpen:false,
      category:'atom',
      name: ''
    }
  }

  toggleCategoryMenu() {
    const isOpen = this.state.isOpen;
    this.setState({
      isOpen:!isOpen
    });
  }

  openDialog(category) {
    this.setState({
      isDialogOpen:true,
      category:category
    })
  }

  closeDialog() {
    this.setState({
      isDialogOpen:false
    })
  }

  changeCategory(e) {
    const state = this.state;
    this.setState(Object.assign({},state,{category:e.target.value}));
  }

  renameComponent(e) {
    const state = this.state;
    this.setState(Object.assign({},state,{name:e.target.value}));
  }

  addComponent() {
    const state = this.state;
    const itemId = this.props.components.length + 1
    this.props.addComponent({
      name:state.name,
      category:state.category,
      html:defaultHtml,
      css:'',
      itemId: itemId
    });
    this.props.selectItem(itemId);
    this.closeDialog();
  }

  render() {
    const isOpen = this.state.isOpen;
    const isDialogOpen = this.state.isDialogOpen;
    const lang = 'ja';
    const category = this.state.category;

    return (
      <div>
        <div className="AtomicLabFAB">
          <button className={classNames("AtomicLabFAB-main","mdl-button","mdl-js-button","mdl-button--fab","mdl-button--colored",{"is-open":isOpen})} style={{position:"absolute"}} onClick={this.toggleCategoryMenu.bind(this)}>
            <i className="material-icons">add</i>
          </button>
          <div className="mdl-tooltip mdl-tooltip--left" data-mdl-for="addAction">Add new component</div>
          <ul className={classNames("AtomicLabFAB-subActionsList",{"is-open":isOpen})}>
            <li>
              <button id="addComponent-atom" className="AtomicLabFAB-miniFAB mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab js-add-category" onClick={this.openDialog.bind(this,'atom')}>
              <img src="./images/iconAtom-s.png" alt="Add Atom" />
              </button>
              <div className="mdl-tooltip mdl-tooltip--left" for="addComponent-atom"></div>
            </li>
            <li>
              <button className="AtomicLabFAB-miniFAB mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab js-add-category" onClick={this.openDialog.bind(this,'molecule')}>
              <img src="./images/iconMolecule-s.png" alt="Add Molecules" />
              </button>
            </li>
            <li>
              <button className="AtomicLabFAB-miniFAB mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab js-add-category" onClick={this.openDialog.bind(this,'organism')}>
              <img src="./images/iconOrganism-s.png" alt="Add Organism" />
              </button>
            </li>
            <li>
              <button className="AtomicLabFAB-miniFAB mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab js-add-category" onClick={this.openDialog.bind(this,'template')}>
              <img src="./images/iconTemplate-s.png" alt="Add Template" />
              </button>
            </li>
          </ul>
        </div>
        <dialog className="mdl-dialog js-new-dialog AtomicLabCategoryDialog" open={isDialogOpen}>
          <h4 className="atomicLabProjectsDialog-title mdl-dialog__title">{lang === 'ja' ? '新規コンポーネント追加' : 'Add New Component'}</h4>
          <div className="mdl-dialog__content">
            <p>{lang === 'ja' ? 'カテゴリー' : 'Category'}</p>
            <RadioGroup name="category" value={this.state.category} onChange={this.changeCategory.bind(this)}>
              <Radio value="atom" ripple>Atom</Radio>
              <Radio value="molecule" ripple>Molecule</Radio>
              <Radio value="organism" ripple>Organism</Radio>
              <Radio value="template" ripple>Template</Radio>
            </RadioGroup>
            <Textfield onChange={this.renameComponent.bind(this)} label="Component Name..." value={this.state.name}/>
          </div>
          <div className="mdl-dialog__actions">
            <button className="mdl-button" onClick={this.addComponent.bind(this)}>{lang === 'ja' ? '追加' : 'Add'}</button>
            <button className="mdl-button close" onClick={this.closeDialog.bind(this)}>{lang === 'ja' ? '閉じる' : 'Close'}</button>
          </div>
        </dialog>
      </div>
    );
  }
}