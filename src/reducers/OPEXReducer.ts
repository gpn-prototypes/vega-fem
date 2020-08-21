import Article from '../../types/Article';
import { OPEXGroup } from '../../types/OPEX/OPEXGroup';
import OPEXSetType from '../../types/OPEX/OPEXSetType';
import Role from '../../types/role';
import { OPEX_ADD_AUTOEXPORT_EXPENSE_SUCCESS } from '../actions/OPEX/addAutoexportExpense';
import { OPEX_ADD_CASE_EXPENSE_SUCCESS } from '../actions/OPEX/addCaseExpense';
import { OPEX_ADD_MKOS_EXPENSE_SUCCESS } from '../actions/OPEX/addMKOSExpense';
import { OPEX_AUTOEXPORT_CHANGE_SUCCESS } from '../actions/OPEX/changeAutoexport';
import { OPEX_AUTOEXPORT_CHANGE_EXPENSE_SUCCESS } from '../actions/OPEX/changeAutoexportExpense';
import { OPEX_MKOS_CHANGE_SUCCESS } from '../actions/OPEX/changeMKOS';
import { OPEX_MKOS_CHANGE_EXPENSE_SUCCESS } from '../actions/OPEX/changeMKOSExpense';
import { OPEX_CASE_CHANGE_EXPENSE_SUCCESS } from '../actions/OPEX/changeOpexCaseExpense';
import { OPEX_CREATE_CASE_SUCCESS } from '../actions/OPEX/createCase';
import { OPEX_SET_SUCCESS, OPEXAction } from '../actions/OPEX/fetchOPEXSet';
import { OPEX_ROLE_SELECTED } from '../actions/OPEX/selectOPEXRole';

const initialState = {
  opex: {} as OPEXSetType,
  selectedRole: { name: 'Обустройство' } as Role,
};

let autoexportExpense;
let mkosExpense;
let caseGroup;
let caseExpense;

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
      // TDOD: change implementation
      /* eslint-disable-line */action.payload?.caseGroup?.opexExpenseList?.push(action.payload?.expense);
      return {
        ...state,
        opex: { ...state.opex },
      };
    case OPEX_AUTOEXPORT_CHANGE_SUCCESS:
      return {
        ...state,
        opex: { ...state.opex, ...{ autoexport: action.payload } },
      };
    case OPEX_AUTOEXPORT_CHANGE_EXPENSE_SUCCESS:
      autoexportExpense = state.opex.autoexport?.opexExpenseList?.filter((expense: Article) => {
        return expense.id === action.payload?.id;
      })[0];
      return {
        ...state,
        opex: {
          ...state.opex,
          ...{
            autoexport: {
              ...state.opex.autoexport,
              ...{
                opexExpenseList: [
                  ...(state.opex.autoexport?.opexExpenseList?.filter(
                    (i: Article) => i.id !== action.payload?.id,
                  ) || []),
                  ...[{ ...autoexportExpense, ...action.payload }],
                ],
              },
            },
          },
        },
      };
    case OPEX_MKOS_CHANGE_EXPENSE_SUCCESS:
      mkosExpense = state.opex.mkos?.opexExpenseList?.filter((expense: Article) => {
        return expense.id === action.payload?.id;
      })[0];
      return {
        ...state,
        opex: {
          ...state.opex,
          ...{
            mkos: {
              ...state.opex.mkos,
              ...{
                opexExpenseList: [
                  ...(state.opex.mkos?.opexExpenseList?.filter(
                    (i: Article) => i.id !== action.payload?.id,
                  ) || []),
                  ...[{ ...mkosExpense, ...action.payload }],
                ],
              },
            },
          },
        },
      };
    case OPEX_CASE_CHANGE_EXPENSE_SUCCESS:
      caseGroup = state.opex.opexCaseList?.filter((caseGroup_: OPEXGroup) => {
        return caseGroup_.id === action.payload?.group.id;
      })[0];
      caseExpense = caseGroup?.opexExpenseList?.filter((expense: Article) => {
        return expense.id === action.payload?.expense.id;
      })[0];
      return {
        ...state,
        opex: {
          ...state.opex,
          ...{
            opexCaseList: [
              ...(state.opex.opexCaseList?.filter(
                (opexCase: OPEXGroup) => opexCase.id !== action.payload?.group?.id,
              ) || []),
              ...[
                {
                  ...caseGroup,
                  ...{
                    opexExpenseList: [
                      ...(caseGroup?.opexExpenseList.filter(
                        (opexExpense: Article) => opexExpense.id !== action.payload?.expense?.id,
                      ) || []),
                      ...[
                        {
                          ...caseExpense,
                          ...action.payload.expense,
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
    case OPEX_MKOS_CHANGE_SUCCESS:
      return {
        ...state,
        opex: { ...state.opex, ...{ mkos: action.payload } },
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
    case OPEX_SET_SUCCESS:
      return {
        ...state,
        opex: action.payload,
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
