import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import Macroparameter from '../../../types/Macroparameters/Macroparameter';

import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

export const OPEX_ADD_AUTOEXPORT_EXPENSE_INIT = 'OPEX_ADD_AUTOEXPORT_EXPENSE_INIT';
export const OPEX_ADD_AUTOEXPORT_EXPENSE_SUCCESS = 'OPEX_ADD_AUTOEXPORT_EXPENSE_SUCCESS';
export const OPEX_ADD_AUTOEXPORT_EXPENSE_ERROR = 'OPEX_ADD_AUTOEXPORT_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAddAutoexportExpenseInit = (): OPEXAction => ({
  type: OPEX_ADD_AUTOEXPORT_EXPENSE_INIT,
});

const OPEXAddAutoexportExpenseSuccess = (expense: Macroparameter): OPEXAction => ({
  type: OPEX_ADD_AUTOEXPORT_EXPENSE_SUCCESS,
  payload: expense,
});

const OPEXAddAutoexportExpenseError = (message: any): OPEXAction => ({
  type: OPEX_ADD_AUTOEXPORT_EXPENSE_ERROR,
  errorMessage: message,
});

export function addAutoexportExpense(
  article: Macroparameter
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAddAutoexportExpenseInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {createOpexAutoexportExpense(` +
            `caption: "${article.caption?.toString()}",` +
            `unit: "${article.unit?.toString()}",` +
            `){opexExpense{id,name,caption,unit,valueTotal,value{year,value}}, ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        console.log(body.data?.createOpexAutoexportExpense?.opexExpense)
        dispatch(OPEXAddAutoexportExpenseSuccess(body.data?.createOpexAutoexportExpense?.opexExpense));
      } else {
        dispatch(OPEXAddAutoexportExpenseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAddAutoexportExpenseError(e));
    }
  };
}
