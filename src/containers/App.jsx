import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import * as Actions from '../actions';

import AtomicLab from '../components/atomic-lab/atomic-lab';
import Header from '../components/header/header';
import SideMenu from '../components/sidemenu/sidemenu';
import MainArea from '../components/mainarea/mainarea';
import AddBtn from '../components/addbtn/addbtn';
import EditDialog from '../components/edit-dialog/edit-dialog';

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    const props = this.props;
    return (
      <AtomicLab {...props}
        header={<Header {...props} />} 
        sideMenu={<SideMenu {...props} />}
        mainArea={
          <MainArea {...props}
          addBtn={<AddBtn {...props} />} 
          editDialog={<EditDialog {...props} />} />
        } 
      />
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
