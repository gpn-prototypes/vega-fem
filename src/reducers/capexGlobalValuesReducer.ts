import CapexSetGlobalValue from '../../types/CapexSetGlobalValue';
import { CapexesAction } from '../actions/capex/capexSet';
import {
  CAPEX_SET_GLOBAL_VALUE_ERROR,
  CAPEX_SET_GLOBAL_VALUE_SUCCESS,
} from '../actions/capex/capexSetGlobalValue';

const initialState = {
  capexSetGlobalValue: {} as CapexSetGlobalValue,
};

export default function capexGlobalValuesReducer(state = initialState, action: CapexesAction) {
  switch (action.type) {
    case CAPEX_SET_GLOBAL_VALUE_SUCCESS:
      return {
        ...state,
        capexSetGlobalValue: action.payload,
      };
    case CAPEX_SET_GLOBAL_VALUE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
