import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Textfield, RadioGroup, Radio } from 'react-mdl';


export default class MainArea extends React.Component {

  constructor() {
    super();
    this.state = {
      name:'',
      category:''
    }
  }

  closeEditDialog() {
    this.props.onClose();
  }

  changeCategory(e) {
    const state = this.state;
    this.setState(Object.assign({},state,{category:e.target.value}));
  }

  renameComponent(e) {
    const state = this.state;
    this.setState(Object.assign({},state,{name:e.target.value}));
  }
  
  updateComponent() {
    const state = this.state;
    const component = state.component;
    const index = state.index;
    const newItem = Object.assign({},component,state);
    this.props.updateComponent(index,newItem);
    this.closeEditDialog();
  }

  componentWillMount(props) {
    this.setState(Object.assign({},this.state,this.props));
  }

  render() {
    const props = this.props;
    const lang = props && props.config && props.config.lang ? props.config.lang : 'ja';
    const component = props.component;
    console.log(lang);
    return (
      <dialog className="mdl-dialog js-new-dialog AtomicLabCategoryDialog" open>
        <h4 className="atomicLabProjectsDialog-title mdl-dialog__title">{lang === 'ja' ? 'コンポーネントの編集' : 'Edit Component'}</h4>
        <div className="mdl-dialog__content">
          <div>
            <RadioGroup name="category" value={this.state.category} onChange={this.changeCategory.bind(this)}>
              <Radio value="atom" ripple>Atom</Radio>
              <Radio value="molecule" ripple>Molecule</Radio>
              <Radio value="organism" ripple>Organism</Radio>
              <Radio value="template" ripple>Template</Radio>
            </RadioGroup>
          </div>
          <Textfield onChange={this.renameComponent.bind(this)} label="Component Name..." value={this.state.name}/>
        </div>
        <div className="mdl-dialog__actions">
          <button className="mdl-button mdl-button--accent" onClick={this.updateComponent.bind(this)}>{lang === 'ja' ? '変更' : 'Update'}</button>
          <button className="mdl-button close" onClick={this.closeEditDialog.bind(this)}>{lang === 'ja' ? '閉じる' : 'Close'}</button>
        </div>
      </dialog>);
  }
}