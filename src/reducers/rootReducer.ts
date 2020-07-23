import { combineReducers } from 'redux';

import capexGlobalValuesReducer from './capexGlobalValuesReducer';
import capexReducer from './capexReducer';
import macroparamsReducer from './macroparamsReducer';

const rootReducer = combineReducers({
  macroparamsReducer,
  capexReducer,
  capexGlobalValuesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
