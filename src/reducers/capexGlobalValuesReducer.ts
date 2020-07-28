import CapexSetGlobalValue from '../../types/CapexSetGlobalValue';
import { CapexesAction } from '../actions/capex/capexSet';
import {
  CAPEX_SET_GLOBAL_VALUE_ERROR,
  CAPEX_SET_GLOBAL_VALUE_FETCH,
  CAPEX_SET_GLOBAL_VALUE_SUCCESS,
} from '../actions/capex/capexSetGlobalValue';
import { CAPEX_SET_UPDATE_ERROR, CAPEX_SET_UPDATE_SUCCESS } from '../actions/capex/updateCapexSet';

const initialState = {
  capexSetGlobalValue: {} as CapexSetGlobalValue,
};

export default function capexReducer(state = initialState, action: CapexesAction) {
  switch (action.type) {
    case CAPEX_SET_GLOBAL_VALUE_FETCH:
    case CAPEX_SET_GLOBAL_VALUE_SUCCESS:
      return {
        ...state,
        capexSetGlobalValue: action.payload,
      };
    case CAPEX_SET_GLOBAL_VALUE_ERROR:
    case CAPEX_SET_UPDATE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CAPEX_SET_UPDATE_SUCCESS:
      return {
        ...state,
        capexSetGlobalValue: action.payload,
      };
    default:
      return state;
  }
}
