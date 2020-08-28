import { combineReducers } from 'redux';

import capexReducer from './capexReducer';
import highlightReducer from './highlightReducer';
import macroparamsReducer from './macroparamsReducer';
import OPEXReducer from './OPEXReducer';

const rootReducer = combineReducers({
  macroparamsReducer,
  capexReducer,
  OPEXReducer,
  highlightReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
