import { combineReducers } from 'redux';

import capexReducer from './capexReducer';
import macroparamsReducer from './macroparamsReducer';
import OPEXReducer from './OPEXReducer';

const rootReducer = combineReducers({
  macroparamsReducer,
  capexReducer,
  OPEXReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
