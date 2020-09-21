import Article, { ArticleValues } from '../../types/Article';
import { OPEXGroup } from '../../types/OPEX/OPEXGroup';
import OPEXSetType from '../../types/OPEX/OPEXSetType';
import Role from '../../types/role';
import { OPEX_ADD_AUTOEXPORT_EXPENSE_SUCCESS } from '../actions/OPEX/addAutoexportExpense';
import { OPEX_ADD_CASE_EXPENSE_SUCCESS } from '../actions/OPEX/addCaseExpense';
import { OPEX_ADD_MKOS_EXPENSE_SUCCESS } from '../actions/OPEX/addMKOSExpense';
import { OPEX_AUTOEXPORT_CHANGE_SUCCESS } from '../actions/OPEX/changeAutoexport';
import { OPEX_AUTOEXPORT_CHANGE_EXPENSE_SUCCESS } from '../actions/OPEX/changeAutoexportExpense';
import { OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS } from '../actions/OPEX/changeAutoexportExpenseYearValue';
import { OPEX_CHANGE_CASE_SUCCESS } from '../actions/OPEX/changeCase';
import { OPEX_MKOS_CHANGE_SUCCESS } from '../actions/OPEX/changeMKOS';
import { OPEX_MKOS_CHANGE_EXPENSE_SUCCESS } from '../actions/OPEX/changeMKOSExpense';
import { OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS } from '../actions/OPEX/changeMKOSExpenseYearValue';
import { OPEX_CASE_CHANGE_EXPENSE_SUCCESS } from '../actions/OPEX/changeOPEXCaseExpense';
import { OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_SUCCESS } from '../actions/OPEX/changeOPEXCaseExpenseYearValue';
import { OPEX_CREATE_CASE_SUCCESS } from '../actions/OPEX/createCase';
import { OPEX_AUTOEXPORT_DELETE_EXPENSE_SUCCESS } from '../actions/OPEX/deleteAutoexportExpense';
import { OPEX_DELETE_CASE_SUCCESS } from '../actions/OPEX/deleteCase';
import { OPEX_MKOS_DELETE_EXPENSE_SUCCESS } from '../actions/OPEX/deleteMKOSExpense';
import { OPEX_CASE_DELETE_EXPENSE_SUCCESS } from '../actions/OPEX/deleteOpexCaseExpense';
import { OPEX_SET_SUCCESS, OPEXAction } from '../actions/OPEX/fetchOPEXSet';
import { OPEX_AUTOEXPORT_REMOVE_SUCCESS } from '../actions/OPEX/removeAutoexport';
import { OPEX_MKOS_REMOVE_SUCCESS } from '../actions/OPEX/removeMKOS';
import { OPEX_ROLE_SELECTED } from '../actions/OPEX/selectOPEXRole';
import { OPEX_SET_SDF_SUCCESS } from '../actions/OPEX/updateOPEXSdf';

const initialState = {
  opex: {} as OPEXSetType,
  selectedRole: { name: 'Обустройство' } as Role,
};

/* let autoexportExpense; */
// let mkosExpense;
let caseGroup: OPEXGroup | undefined;
// let caseExpense;

export default function OPEXReducer(state = initialState, action: OPEXAction) {
  switch (action.type) {
    case OPEX_CREATE_CASE_SUCCESS:
      return {
        ...state,
        opex: {
          ...state.opex,
          ...{
            opexCaseList: [...(state.opex?.opexCaseList || []), ...[action.payload]],
          },
        },
      };
    case OPEX_ADD_CASE_EXPENSE_SUCCESS:
      // TODO: change implementation
      /* eslint-disable-line */action.payload?.caseGroup?.opexExpenseList?.push(action.payload?.expense);
      return {
        ...state,
        opex: {
          ...state.opex,
          opexCaseList: (state.opex.opexCaseList ?? []).map((opexCase: OPEXGroup) => opexCase),
        },
      };
    case OPEX_AUTOEXPORT_CHANGE_SUCCESS:
      return {
        ...state,
        opex: { ...state.opex, ...{ autoexport: action.payload } },
      };
    case OPEX_AUTOEXPORT_REMOVE_SUCCESS:
      return {
        ...state,
        opex: { ...state.opex, ...{ hasAutoexport: false }, ...{ autoexport: null } },
      };
    case OPEX_AUTOEXPORT_CHANGE_EXPENSE_SUCCESS:
      return {
        ...state,
        opex: {
          ...state.opex,
          ...{
            autoexport: {
              ...state.opex.autoexport,
              ...{
                opexExpenseList: [
                  ...(state.opex.autoexport?.opexExpenseList as Array<Article>)?.map(
                    (i: Article) => {
                      if (i.id === action.payload?.id) {
                        return { ...action.payload };
                      }
                      return { ...i };
                    },
                  ),
                ],
              },
            },
          },
        },
      };
    case OPEX_AUTOEXPORT_DELETE_EXPENSE_SUCCESS:
      return {
        ...state,
        opex: {
          ...state.opex,
          ...{
            autoexport: {
              ...state.opex.autoexport,
              ...{
                opexExpenseList: [
                  ...(state.opex.autoexport?.opexExpenseList as Array<Article>)?.filter(
                    (article: Article) => article.id !== action.payload.id,
                  ),
                ],
              },
            },
          },
        },
      };
    case OPEX_MKOS_CHANGE_EXPENSE_SUCCESS:
      return {
        ...state,
        opex: {
          ...state.opex,
          ...{
            mkos: {
              ...state.opex.mkos,
              ...{
                opexExpenseList: [
                  ...(state.opex.mkos?.opexExpenseList as Array<Article>)?.map((i: Article) => {
                    if (i.id === action.payload?.id) {
                      return { ...action.payload };
                    }
                    return { ...i };
                  }),
                ],
              },
            },
          },
        },
      };
    case OPEX_MKOS_DELETE_EXPENSE_SUCCESS:
      return {
        ...state,
        opex: {
          ...state.opex,
          ...{
            mkos: {
              ...state.opex.mkos,
              ...{
                opexExpenseList: [
                  ...(state.opex.mkos?.opexExpenseList as Array<Article>)?.filter(
                    (article: Article) => article.id !== action.payload.id,
                  ),
                ],
              },
            },
          },
        },
      };
    case OPEX_CASE_CHANGE_EXPENSE_SUCCESS:
      caseGroup = state.opex.opexCaseList?.find((caseGroup_: OPEXGroup) => {
        return caseGroup_.id === action.payload?.group.id;
      });
      return {
        ...state,
        opex: {
          ...state.opex,
          ...{
            opexCaseList: [
              ...(state.opex.opexCaseList as Array<OPEXGroup>).map((opexCase: OPEXGroup) => {
                if (opexCase.id === action.payload.group.id) {
                  return {
                    ...{
                      ...action.payload.group,
                      opexExpenseList: [
                        ...(caseGroup?.opexExpenseList as Array<Article>)?.map(
                          (opexExpense: Article) => {
                            if (opexExpense.id === action.payload?.expense?.id) {
                              return { ...action.payload.expense };
                            }
                            return { ...opexExpense };
                          },
                        ),
                      ],
                    },
                  };
                }
                return { ...opexCase };
              }),
            ],
          },
        },
      };
    case OPEX_CASE_DELETE_EXPENSE_SUCCESS:
      caseGroup = state.opex.opexCaseList?.find((caseGroup_: OPEXGroup) => {
        return caseGroup_.id === action.payload?.group.id;
      });
      return {
        ...state,
        opex: {
          ...state.opex,
          ...{
            opexCaseList: [
              ...(state.opex.opexCaseList as Array<OPEXGroup>).map((opexCase: OPEXGroup) => {
                if (opexCase.id === action.payload.group.id) {
                  return {
                    ...{
                      ...action.payload.group,
                      opexExpenseList: [
                        ...(caseGroup?.opexExpenseList as Array<Article>)?.filter(
                          (opexExpense: Article) => opexExpense.id !== action.payload?.expense?.id,
                        ),
                      ],
                    },
                  };
                }
                return { ...opexCase };
              }),
            ],
          },
        },
      };
    case OPEX_MKOS_CHANGE_SUCCESS:
      return {
        ...state,
        opex: { ...state.opex, ...{ mkos: action.payload } },
      };
    case OPEX_MKOS_REMOVE_SUCCESS:
      return {
        ...state,
        opex: { ...state.opex, ...{ hasMkos: false }, ...{ mkos: null } },
      };
    case OPEX_ADD_AUTOEXPORT_EXPENSE_SUCCESS:
      return {
        ...state,
        opex: {
          ...state.opex,
          ...{
            autoexport: {
              ...state.opex.autoexport,
              ...{
                opexExpenseList: [
                  ...(state.opex.autoexport?.opexExpenseList || []),
                  ...[action.payload],
                ],
              },
            },
          },
        },
      };
    case OPEX_ADD_MKOS_EXPENSE_SUCCESS:
      return {
        ...state,
        opex: {
          ...state.opex,
          ...{
            mkos: {
              ...state.opex.mkos,
              ...{
                opexExpenseList: [...(state.opex.mkos?.opexExpenseList || []), ...[action.payload]],
              },
            },
          },
        },
      };
    case OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS:
      return {
        ...state,
        opex: {
          ...state.opex,
          autoexport: {
            ...state.opex.autoexport,
            opexExpenseList: (state.opex.autoexport?.opexExpenseList ?? []).map(
              (article: Article) => {
                if (article.id === action.payload.article.id) {
                  return {
                    ...article,
                    value: (article.value as ArticleValues[]).map((value: ArticleValues) => {
                      if (value.year === action.payload.value.year) {
                        return action.payload.value;
                      }
                      return value;
                    }),
                  };
                }
                return article;
              },
            ),
          },
        },
      };
    case OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS:
      return {
        ...state,
        opex: {
          ...state.opex,
          mkos: {
            ...state.opex.mkos,
            opexExpenseList: (state.opex.mkos?.opexExpenseList ?? []).map((article: Article) => {
              if (article.id === action.payload.article.id) {
                return {
                  ...article,
                  value: (article.value as ArticleValues[]).map((value: ArticleValues) => {
                    if (value.year === action.payload.value.year) {
                      return action.payload.value;
                    }
                    return value;
                  }),
                };
              }
              return article;
            }),
          },
        },
      };
    case OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_SUCCESS:
      return {
        ...state,
        opex: {
          ...state.opex,
          opexCaseList: (state.opex.opexCaseList ?? []).map((group: OPEXGroup) => {
            if (group.id === action.payload.group.id) {
              return {
                ...group,
                opexExpenseList: group.opexExpenseList.map((article: Article) => {
                  if (article.id === action.payload.article.id) {
                    return {
                      ...article,
                      value: (article.value as ArticleValues[]).map((value: ArticleValues) => {
                        if (value.year === action.payload.value.year) {
                          return action.payload.value;
                        }
                        return value;
                      }),
                    };
                  }
                  return article;
                }),
              };
            }
            return group;
          }),
        },
      };
    case OPEX_CHANGE_CASE_SUCCESS:
      return {
        ...state,
        opex: {
          ...state.opex,
          opexCaseList: (state.opex.opexCaseList ?? []).map((group: OPEXGroup) => {
            if (group.id === action.payload.id) {
              return {
                ...group,
                caption: action.payload.caption,
              };
            }
            return { ...group };
          }),
        },
      };
    case OPEX_DELETE_CASE_SUCCESS:
      return {
        ...state,
        opex: {
          ...state.opex,
          opexCaseList: (state.opex.opexCaseList ?? []).filter(
            (group: OPEXGroup) => group.id !== action.payload.id,
          ),
        },
      };
    case OPEX_SET_SUCCESS:
      return {
        ...state,
        opex: action.payload,
      };
    case OPEX_SET_SDF_SUCCESS:
      return {
        ...state,
        opex: { ...state.opex, sdf: action.payload },
      };
    case OPEX_ROLE_SELECTED:
      return {
        ...state,
        selectedRole: { ...action.payload },
      };
    default:
      return state;
  }
}
