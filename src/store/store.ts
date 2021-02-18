import { applyMiddleware, createStore, Middleware, Store } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk';

import { getAppConfig } from '../../app-config';
import { MacroparamsAction } from '../actions/Macroparameters/macroparameterSetList';
import rootReducer from '../reducers/rootReducer';

const logger = createLogger({
  collapsed: true,
});

const middlewares: Array<Middleware | ThunkMiddleware> = [thunkMiddleware];

if (getAppConfig().mode === 'development') {
  middlewares.push(logger);
}

const store = (preloadedState?: any): Store<any, MacroparamsAction> => {
  return createStore(rootReducer, preloadedState, applyMiddleware(...middlewares));
};

export default store();
