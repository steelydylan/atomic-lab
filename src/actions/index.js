import * as types from '../constants/ActionTypes';

export const setConfig = (config) => ({ type: types.SETCONFIG, config:config });

export const setComponents = (components) => ({ type: types.SETCOMPONENTS, components:components });

export const selectItem = (itemId) => ({ type: types.SELECTITEM, itemId:itemId });

export const updateComponent = (index, component) => ( { type: types.UPDATECOMPONENT, index, component });

export const removeComponent = (index) => ( { type: types.REMOVECOMPONENT, index });

export const addComponent = (component) => ( { type: types.ADDCOMPONENT, component });