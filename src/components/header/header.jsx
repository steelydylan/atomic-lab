import React, { Component, PropTypes } from 'react';
import { Menu, MenuItem, Tooltip, Icon } from 'react-mdl';
import ProjectDialog from '../project-dialog/project-dialog';

export default class Header extends React.Component {

  constructor() {
    super();
    this.state = {
      is_open: false
    };
  }

  openDialog() {
    this.setState({
      is_open: true
    })
  }

  closeDialog() {
    this.setState({
      is_open: false
    })
  }

  render() {
    const state = this.state;
    const config = this.props.config;
    return (
      <header className="mdl-layout__header atomicLabHeader">
        <div className="mdl-layout__header-row atomicLabHeader-row">
          <span className="mdl-layout-title mdl-layout-logo">{config ? config.title : null}</span>
          <div className="mdl-layout-spacer"></div>
          <nav className="mdl-navigation">
            <Tooltip label="If you like this,Please star on GitHub! ;D" position="bottom">
              <a id="Navi-github" className="mdl-navigation__link" href="https://github.com/steelydylan/atomic-lab" target="_blank"><img className="atomicLabHeader-gitHubMark" src="./images/githubMark.png" alt="GitHub" /></a>
            </Tooltip>
          </nav>
        </div>
        <ProjectDialog isOpen={state.is_open} onClose={this.closeDialog.bind(this)} />
      </header>);
  }
}
