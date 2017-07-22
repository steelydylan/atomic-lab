import * as types from '../constants/ActionTypes';
// import JSZIP from 'jszip';

const initialState = {
  config: {
      config: {},
      components: [],
      itemId: 0
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SETCONFIG:
      return Object.assign({}, state, { config: action.config });
    case types.SETCOMPONENTS:
      return Object.assign({}, state, { components: [...action.components] });
    case types.SELECTITEM:
      return Object.assign({}, state, { itemId: action.itemId });
    case types.UPDATECOMPONENT:
      return Object.assign({}, state, { 
        components: [
          ...state.components.slice(0, action.index),
          action.component,
          ...state.components.slice(action.index+1)
        ] });
    case types.REMOVECOMPONENT:
      return Object.assign({}, state, {
        components: [
          ...state.components.slice(0, action.index),
          ...state.components.slice(action.index+1)
        ]});
    case types.ADDCOMPONENT:
      return Object.assign({}, state, {
        components: [
          ...state.components,
          action.component
        ]});
    default:
      return state;
  }
};