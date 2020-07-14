import MacroparameterSet from '../../types/MacroparameterSet';
import {
  MACROPARAMS_SET_LIST_ERROR,
  MACROPARAMS_SET_LIST_FETCH,
  MACROPARAMS_SET_LIST_SUCCESS,
  MACROPARAMS_SET_SELECTED,
  MacroparamsAction,
} from '../actions/macroparametersSetList';

const initialState = {
  macroparameterSetList: [] as MacroparameterSet[],
  selected: null,
};

export default function macroparamsReducer(state = initialState, action: MacroparamsAction) {
  switch (action.type) {
    case MACROPARAMS_SET_LIST_FETCH:
    case MACROPARAMS_SET_LIST_SUCCESS:
      return {
        ...state,
        macroparameterSetList: action.payload,
      };
    case MACROPARAMS_SET_LIST_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case MACROPARAMS_SET_SELECTED:
      return {
        ...state,
        selected: action.payload,
      };
    default:
      return state;
  }
}
