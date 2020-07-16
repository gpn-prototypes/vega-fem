import { applyMiddleware, createStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import { MacroparamsAction } from '../actions/macroparameterSetList';
import rootReducer from '../reducers/rootReducer';

const logger = createLogger();

const store = (preloadedState?: any): Store<any, MacroparamsAction> => {
  return createStore(rootReducer, preloadedState, applyMiddleware(thunkMiddleware, logger));
};

export default store();
