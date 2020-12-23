import { MACROPARAM_SET_GROUP_ADD_SUCCESS } from '../actions/Macroparameters/addMacroparameterSetGroup';
import { MACROPARAM_SET_GROUP_CHANGE_SUCCESS } from '../actions/Macroparameters/changeMacroparameterSetGroup';
import { MACROPARAM_SET_GROUP_DELETE_SUCCESS } from '../actions/Macroparameters/deleteMacroparameterSetGroup';
import {
  ARTICLE_HIGHLIGHT,
  ARTICLE_HIGHLIGHT_CLEAR,
} from '../actions/Macroparameters/highlightMacroparameter';
import { MACROPARAM_ADD_SUCCESS } from '../actions/Macroparameters/macroparameter/addMacroparameter';
import { CHANGE_MACROPARAM_SUCCESS } from '../actions/Macroparameters/macroparameter/changeMacroparameter';
import { MACROPARAM_DELETE_SUCCESS } from '../actions/Macroparameters/macroparameter/deleteMacroparameter';
import {
  MACROPARAMS_SET_LIST_ERROR,
  // MACROPARAMS_SET_LIST_FETCH,
  MACROPARAMS_SET_LIST_SUCCESS,
  MACROPARAMS_SET_SELECTED,
  MacroparamsAction,
} from '../actions/Macroparameters/macroparameterSetList';
import {
  MACROPARAM_SET_UPDATE_ERROR,
  MACROPARAM_SET_UPDATE_SUCCESS,
} from '../actions/Macroparameters/updateMacroparameterSet';
import { MACROPARAM_UPDATE_YEAR_VALUE_SUCCESS } from '../actions/Macroparameters/updateMacroparameterYearValue';

import { FEM_CLEAR_STORES } from '@/actions/clear';
import Article, { ArticleValues } from '@/types/Article';
import MacroparameterSet from '@/types/Macroparameters/MacroparameterSet';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export interface MacroparametersState {
  macroparameterSetList: MacroparameterSet[];
  selected: string | number;
  focusedArticle: any;
  error?: any;
}

const initialState: MacroparametersState = {
  macroparameterSetList: [],
  selected: '',
  focusedArticle: {},
};

// let groupList: MacroparameterSetGroup[];
// let group: MacroparameterSetGroup;
// let macroparameterList: Array<Article>;
let macr: Article;
let value: ArticleValues[];
let isNewYearValue: boolean;

export default function macroparamsReducer(
  state: MacroparametersState = initialState,
  action: MacroparamsAction,
): MacroparametersState {
  switch (action.type) {
    case FEM_CLEAR_STORES:
      return { ...initialState };
    case MACROPARAMS_SET_LIST_SUCCESS:
      return {
        ...state,
        macroparameterSetList: [
          ...action.payload.macroparameterSetList.map(
            (macroparameterSet: any, setIndex: number) => {
              return {
                ...macroparameterSet,
                macroparameterGroupList: [
                  ...action.payload.macroparameterSetList[
                    setIndex
                  ].macroparameterGroupList.macroparameterGroupList.map(
                    (macroparameterGroup: any, groupIndex: number) => {
                      return {
                        ...macroparameterGroup,
                        macroparameterList: [
                          ...action.payload.macroparameterSetList[setIndex].macroparameterGroupList
                            .macroparameterGroupList[groupIndex].macroparameterList
                            .macroparameterList,
                        ],
                      };
                    },
                  ),
                ],
              };
            },
          ),
        ],
      };
    case MACROPARAMS_SET_LIST_ERROR:
    case MACROPARAM_SET_UPDATE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case MACROPARAMS_SET_SELECTED:
      return {
        ...state,
        selected: action.payload.id,
      };
    case MACROPARAM_SET_UPDATE_SUCCESS:
      /* eslint-disable-next-line */
      const merged = {
        ...action.payload,
        macroparameterGroupList: [
          ...action.payload.macroparameterGroupList.macroparameterGroupList.map(
            (macroparameterGroup: any, groupIndex: number) => {
              return {
                ...macroparameterGroup,
                macroparameterList: [
                  ...action.payload.macroparameterGroupList.macroparameterGroupList[groupIndex]
                    .macroparameterList.macroparameterList,
                ],
              };
            },
          ),
        ],
      };
      return {
        ...state,
        macroparameterSetList: state.macroparameterSetList.map((macroparameterSet) => {
          return macroparameterSet.id === merged.id ? merged : macroparameterSet;
        }),
      };
    case MACROPARAM_SET_GROUP_ADD_SUCCESS:
      return {
        ...state,
        macroparameterSetList: state.macroparameterSetList.map((i) => {
          return i.id === state.selected
            ? {
                ...i,
                macroparameterGroupList: [...(i.macroparameterGroupList ?? []), action.payload],
              }
            : i;
        }),
      };
    case MACROPARAM_SET_GROUP_CHANGE_SUCCESS:
      return {
        ...state,
        macroparameterSetList: state.macroparameterSetList.map((i) => {
          return i.id === state.selected
            ? {
                ...i,
                macroparameterGroupList:
                  i.macroparameterGroupList?.map((groupItem) => {
                    if (groupItem.id === action.payload.id) {
                      return {
                        ...groupItem,
                        caption: action.payload.caption,
                      };
                    }
                    return { ...groupItem };
                  }) ?? [],
              }
            : i;
        }),
      };
    case MACROPARAM_SET_GROUP_DELETE_SUCCESS:
      return {
        ...state,
        macroparameterSetList: state.macroparameterSetList.map((i) => {
          return i.id === state.selected
            ? {
                ...i,
                macroparameterGroupList: [
                  ...(i.macroparameterGroupList ?? []).filter(
                    (groupItem: MacroparameterSetGroup) => groupItem.id !== action.payload.id,
                  ),
                ],
              }
            : i;
        }),
      };
    case MACROPARAM_ADD_SUCCESS:
      return {
        ...state,
        macroparameterSetList: state.macroparameterSetList.map((i) => {
          return i.id === state.selected
            ? {
                ...i,
                macroparameterGroupList:
                  i.macroparameterGroupList?.map((group) => {
                    return group.id === action.payload.group?.id
                      ? {
                          ...group,
                          macroparameterList: [
                            ...(group.macroparameterList ?? []),
                            action.payload?.macroparameter,
                          ],
                        }
                      : group;
                  }) ?? [],
              }
            : i;
        }),
      };
    case CHANGE_MACROPARAM_SUCCESS:
      return {
        ...state,
        macroparameterSetList: state.macroparameterSetList.map((i) => {
          return i.id === state.selected
            ? {
                ...i,
                macroparameterGroupList:
                  i.macroparameterGroupList?.map((group) => {
                    return group.id === action.payload.group?.id
                      ? {
                          ...group,
                          macroparameterList:
                            group.macroparameterList?.map((mp) => {
                              return mp.id === action.payload.macroparameter?.id
                                ? { ...action.payload.macroparameter }
                                : mp;
                            }) ?? [],
                        }
                      : group;
                  }) ?? [],
              }
            : i;
        }),
      };

    case MACROPARAM_DELETE_SUCCESS:
      return {
        ...state,
        macroparameterSetList: state.macroparameterSetList.map((i) => {
          return i.id === state.selected
            ? {
                ...i,
                macroparameterGroupList:
                  i.macroparameterGroupList?.map((group) => {
                    return group.id === action.payload.group?.id
                      ? {
                          ...group,
                          macroparameterList: group.macroparameterList?.filter(
                            (mp) => mp.id !== action.payload.macroparameter?.id,
                          ),
                        }
                      : group;
                  }) ?? [],
              }
            : i;
        }),
      };
    case MACROPARAM_UPDATE_YEAR_VALUE_SUCCESS:
      macr = action.payload.macroparameter as Article;
      value = (macr?.value as ArticleValues[]).map((v) => {
        if (v.year === action.payload.value?.year) {
          return { ...v, value: action.payload.value?.value };
        }
        return v;
      });

      // обновление значения в ранее незаполненном году
      isNewYearValue = value.filter((i) => i.year === action.payload.value?.year).length === 0;
      if (isNewYearValue) {
        value.push(action.payload.value);
      }

      return {
        ...state,
        macroparameterSetList: state.macroparameterSetList.map((i) => {
          return i.id === state.selected
            ? {
                ...i,
                macroparameterGroupList:
                  i.macroparameterGroupList?.map((group) => {
                    return group.id === action.payload.group?.id
                      ? {
                          ...group,
                          macroparameterList:
                            group.macroparameterList?.map((mp) => {
                              return mp.id === action.payload.macroparameter?.id
                                ? { ...mp, value }
                                : mp;
                            }) ?? [],
                        }
                      : group;
                  }) ?? [],
              }
            : i;
        }),
      };
    case ARTICLE_HIGHLIGHT:
      return {
        ...state,
        focusedArticle: {
          group: action.payload.group,
          article: action.payload.article,
        },
      };
    case ARTICLE_HIGHLIGHT_CLEAR:
      return {
        ...state,
        focusedArticle: {},
      };
    default:
      return state;
  }
}
