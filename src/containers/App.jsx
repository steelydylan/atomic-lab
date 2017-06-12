import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import * as Actions from '../actions';
import AtomicLab from '../components/atomic-lab/atomic-lab';

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    const props = this.props;
    return (<AtomicLab {...props} />);
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
