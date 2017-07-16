import React from 'react';
import SplitPane from 'react-split-pane';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import './style.css';
import './dialog-polyfill.css'
import './atomic-lab.scss';

export default class AtomicLab extends React.Component {
  constructor() {
    super();
    this.state = {
      paneSize:320
    }
  }

  render() {
    const props = this.props;
    const paneSize = this.state.paneSize;
    
    return (
      <div className="mdl-layout">
        {this.props.header}
        <SplitPane split="vertical" minSize={100} defaultSize={paneSize} className="mdl-layout__content atomicLabContent">
          {this.props.sideMenu}
          {this.props.mainArea}
        </SplitPane>
      </div>
    );
  }
}
