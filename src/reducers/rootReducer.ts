import { combineReducers } from 'redux';

import capexGlobalValuesReducer from './capexGlobalValuesReducer';
import capexReducer from './capexReducer';
import macroparamsReducer from './macroparamsReducer';
import OPEXReducer from './OPEXReducer';

const rootReducer = combineReducers({
  macroparamsReducer,
  capexReducer,
  capexGlobalValuesReducer,
  OPEXReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
