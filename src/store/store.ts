import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';


const logger = createLogger();

const store = (preloadedState? : any) => {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunkMiddleware, logger)
  )
};

export default store();
