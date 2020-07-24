import CapexSet from '../../types/CapexSet';
import { CAPEX_SET_GROUP_ADD_SUCCESS } from '../actions/capex/addCapexSetGroup';
import {
  CAPEX_SET_ERROR,
  CAPEX_SET_FETCH,
  CAPEX_SET_SELECTED,
  CAPEX_SET_SUCCESS,
  CapexesAction,
} from '../actions/capex/capexSet';
import { CAPEX_SET_UPDATE_ERROR, CAPEX_SET_UPDATE_SUCCESS } from '../actions/capex/updateCapexSet';

const initialState = {
  capexSet: {} as CapexSet,
  selected: {} as CapexSet,
};

export default function capexReducer(state = initialState, action: CapexesAction) {
  switch (action.type) {
    case CAPEX_SET_FETCH:
    case CAPEX_SET_SUCCESS:
      return {
        ...state,
        capexSet: action.payload,
      };
    case CAPEX_SET_ERROR:
    case CAPEX_SET_UPDATE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CAPEX_SET_SELECTED:
    case CAPEX_SET_UPDATE_SUCCESS:
      return {
        ...state,
        selected: action.payload,
        capexSet: action.payload,
      };
    case CAPEX_SET_GROUP_ADD_SUCCESS:
      return {
        ...state,
        selected: state.selected,
      };
    default:
      return state;
  }
}
