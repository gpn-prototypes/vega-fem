import { combineReducers } from 'redux';

import capexReducer from './capexReducer';
import highlightReducer from './highlightReducer';
import macroparamsReducer from './macroparamsReducer';
import notificationsReducer from './notificationsReducer';
import OPEXReducer from './OPEXReducer';
import versionReducer from './versionReducer';

const rootReducer = combineReducers({
  macroparamsReducer,
  capexReducer,
  OPEXReducer,
  highlightReducer,
  versionReducer,
  notificationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
