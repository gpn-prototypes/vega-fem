import MacroparameterSet from '../../types/MacroparameterSet';
import { MACROPARAM_SET_GROUP_ADD_SUCCESS } from '../actions/addMacroparameterSetGroup';
import {
  MACROPARAMS_SET_LIST_ERROR,
  MACROPARAMS_SET_LIST_FETCH,
  MACROPARAMS_SET_LIST_SUCCESS,
  MACROPARAMS_SET_SELECTED,
  MacroparamsAction,
} from '../actions/macroparameterSetList';
import {
  MACROPARAM_SET_UPDATE_ERROR,
  MACROPARAM_SET_UPDATE_SUCCESS,
} from '../actions/updateMacroparameterSet';

const initialState = {
  macroparameterSetList: [] as MacroparameterSet[],
  selected: {} as MacroparameterSet,
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
    case MACROPARAM_SET_UPDATE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case MACROPARAMS_SET_SELECTED:
    case MACROPARAM_SET_UPDATE_SUCCESS:
      return {
        ...state,
        selected: action.payload,
        macroparameterSetList: state.macroparameterSetList.map((macroparameterSet) =>
          macroparameterSet.id === action.payload.id ? action.payload : macroparameterSet,
        ),
      };
    case MACROPARAM_SET_GROUP_ADD_SUCCESS:
      state?.selected?.macroparameterGroupList?.push(action.payload);
      return {
        ...state,
        selected: state.selected
      };
    default:
      return state;
  }
}
