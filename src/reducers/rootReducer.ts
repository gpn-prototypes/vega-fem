import { combineReducers, Reducer } from 'redux';

import { MacroparamsAction } from '../actions/macroparameterSetList';

import macroparamsReducer from './macroparamsReducer';

const rootReducer: Reducer<
  any,
  /* TODO: create genaral rootReducesActions type */ MacroparamsAction
> = combineReducers({
  macroparamsReducer,
});

export default rootReducer;
