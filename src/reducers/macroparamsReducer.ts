import Macroparameter, {MacroparameterValues} from '../../types/Macroparameter';
import MacroparameterSet from '../../types/MacroparameterSet';
import MacroparameterSetGroup from '../../types/MacroparameterSetGroup';
import { MACROPARAM_ADD_SUCCESS } from '../actions/addMacroparameter';
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
import { MACROPARAM_UPDATE_VALUE_SUCCESS } from '../actions/updateMacroparameterValue';
import {MACROPARAM_UPDATE_YEAR_VALUE_SUCCESS} from '../actions/updateMacroparameterYearValue';

const initialState = {
  macroparameterSetList: [] as MacroparameterSet[],
  selected: {} as MacroparameterSet,
};

let groupList,
  group: any,
  macroparameterList,
  macr: Macroparameter,
  value: MacroparameterValues[];

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
      /* eslint-disable-line */state?.selected?.macroparameterGroupList?.push(action.payload);
      return {
        ...state,
        selected: { ...state.selected },
      };
    case MACROPARAM_ADD_SUCCESS:
      /* eslint-disable-line */state?.selected?.macroparameterGroupList
        ?.find((group: MacroparameterSetGroup) => group.id === action.payload.group?.id)
        ?.macroparameterList?.push(action.payload?.macroparameter);
      return {
        ...state,
        selected: { ...state.selected },
      };
    case MACROPARAM_UPDATE_VALUE_SUCCESS:
      /* eslint-disable-line */groupList = (state?.selected?.macroparameterGroupList ??
        []) as MacroparameterSetGroup[];
      /* eslint-disable-line */group = (groupList?.find(
        (groupItem: MacroparameterSetGroup) => groupItem.id === action.payload.group?.id,
      ) ?? {}) as MacroparameterSetGroup;
      /* eslint-disable-line */macroparameterList = group?.macroparameterList ?? [];
      /* eslint-disable-line */macr = (macroparameterList?.find(
        (macroparameter: Macroparameter) => macroparameter.id === action.payload.macroparameter?.id,
      ) ?? {}) as Macroparameter;
      return {
        ...state,
        selected: {
          ...state.selected,
          ...{
            macroparameterGroupList: [
              ...groupList.filter((i) => i.id !== group.id),
              ...[
                {
                  ...group,
                  ...{
                    macroparameterList: [
                      ...macroparameterList.filter((i: Macroparameter) => i.id !== macr.id),
                      ...[{ ...macr, ...action.payload.macroparameter }],
                    ],
                  },
                },
              ],
            ],
          },
        },
      };
    case MACROPARAM_UPDATE_YEAR_VALUE_SUCCESS:
      groupList = (state?.selected?.macroparameterGroupList ??
        []) as MacroparameterSetGroup[];
      group = (groupList?.find(
        (groupItem: MacroparameterSetGroup) => groupItem.id === action.payload.group?.id,
      ) ?? {}) as MacroparameterSetGroup;
      macroparameterList = group?.macroparameterList ?? [];
      macr = (macroparameterList?.find(
        (macroparameter: Macroparameter) => macroparameter.id === action.payload.macroparameter?.id,
      ) ?? {}) as Macroparameter;
      value = (macr?.value as MacroparameterValues[]).map(i => {
        if (i.year  === action.payload.value?.year) {
          i.value = action.payload.value?.value;
        }
        return i;
      });
      return {
        ...state,
        selected: {
          ...state.selected,
          ...{
            macroparameterGroupList: [
              ...groupList.filter(i => i.id !== group.id),
              ...[
                {
                  ...group,
                  ...{
                    macroparameterList: [
                      ...macroparameterList.filter((i: Macroparameter) => i.id !== macr.id),
                      ...[
                        {
                          ...macr,
                          ...{value: value}
                        },
                      ],
                    ],
                  },
                },
              ],
            ],
          },
        },
      };
    default:
      return state;
  }
}
