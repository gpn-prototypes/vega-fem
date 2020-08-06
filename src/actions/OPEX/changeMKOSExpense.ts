import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import Macroparameter from '../../../types/Macroparameters/Macroparameter';

import OPEXSetType from '../../../types/OPEX/OPEXSetType';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

export const OPEX_AUTOEXPORT_CHANGE_EXPENSE_INIT = 'OPEX_AUTOEXPORT_CHANGE_EXPENSE_INIT';
export const OPEX_AUTOEXPORT_CHANGE_EXPENSE_SUCCESS = 'OPEX_AUTOEXPORT_CHANGE_EXPENSE_SUCCESS';
export const OPEX_AUTOEXPORT_CHANGE_EXPENSE_ERROR = 'OPEX_AUTOEXPORT_CHANGE_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAutoexportChangeExpenseInit = (): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_INIT,
});

const OPEXAutoexportChangeExpenseSuccess = (OPEXSetInstance: OPEXSetType): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_SUCCESS,
  payload: OPEXSetInstance,
});

const OPEXAutoexportChangeExpenseError = (message: any): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_ERROR,
  errorMessage: message,
});

export function autoexportChangeExpense(
  article: Macroparameter
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAutoexportChangeExpenseInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {changeOpexAutoexportExpense(` +
            `expenseId: ${article.id?.toString()},` +
            `name: "${article.name?.toString()}",` +
            `caption: "${article.caption?.toString()}",` +
            `unit: "${article.unit?.toString()}",` +
            `value: ${article.valueTotal?.toString()}` +
            `){opexExpense{id,name,caption,unit,valueTotal,value{year,value}}, ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(OPEXAutoexportChangeExpenseSuccess(body.data?.opex));
      } else {
        dispatch(OPEXAutoexportChangeExpenseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAutoexportChangeExpenseError(e));
    }
  };
}
