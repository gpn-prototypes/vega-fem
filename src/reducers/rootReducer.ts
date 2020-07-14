import { combineReducers, Reducer } from 'redux';

import { MacroparamsAction } from '../actions/macroparametersSetList';

import macroparamsReducer from './macroparamsReducer';

const rootReducer: Reducer<
  any,
  /* TODO: create genaral rootReducesActions type */ MacroparamsAction
> = combineReducers({
  macroparamsReducer,
});

export default rootReducer;
