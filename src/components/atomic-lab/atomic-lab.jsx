import React from 'react';
import SplitPane from 'react-split-pane';
import Header from '../header/header';
import SideMenu from '../sidemenu/sidemenu';
import MainArea from '../mainarea/mainarea';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import '../../../css/style.css';
import '../../../css/dialog-polyfill.css'
import './atomic-lab.scss';
import axios from 'axios';

export default class AtomicLab extends React.Component {
  constructor() {
    super();
    this.state = {
      paneSize:320
    }
  }

  componentDidMount() {
    axios.get('./config.json').then(item => {
      this.props.setConfig(item.data);
      this.setComponents();
    });
  }

  setComponents() {
    const config = this.props.config;
    const hash = location.hash;
    axios.get(config.local_file_path).then(item => {
      this.props.setComponents(item.data.components);
      if(item.data.components.length >= 1) {
        let itemId = item.data.components[0].itemId;
        this.props.components.forEach((item, i) => {
          if (`#${item.itemId}` === hash) {
            itemId = item.itemId;
          }
        });
        this.props.selectItem(itemId);
      }
    });
  }

  render() {
    const props = this.props;
    const paneSize = this.state.paneSize;
    
    return (
      <div className="mdl-layout">
        <Header {...props} />
        <SplitPane split="vertical" minSize={100} defaultSize={paneSize} className="mdl-layout__content atomicLabContent">
          <SideMenu {...props} />
          <MainArea {...props} />
        </SplitPane>
      </div>
    );
  }
}
