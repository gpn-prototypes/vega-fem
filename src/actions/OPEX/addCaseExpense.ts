import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Macroparameter from '../../../types/Macroparameters/Macroparameter';
import { OPEXGroup } from '../../../types/OPEX/OPEXGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

export const OPEX_ADD_CASE_EXPENSE_INIT = 'OPEX_ADD_CASE_EXPENSE_INIT';
export const OPEX_ADD_CASE_EXPENSE_SUCCESS = 'OPEX_ADD_CASE_EXPENSE_SUCCESS';
export const OPEX_ADD_CASE_EXPENSE_ERROR = 'OPEX_ADD_CASE_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAddCaseExpenseInit = (): OPEXAction => ({
  type: OPEX_ADD_CASE_EXPENSE_INIT,
});

const OPEXAddCaseExpenseSuccess = (caseGroup: OPEXGroup, expense: Macroparameter): OPEXAction => ({
  type: OPEX_ADD_CASE_EXPENSE_SUCCESS,
  payload: { caseGroup, expense },
});

const OPEXAddCaseExpenseError = (message: any): OPEXAction => ({
  type: OPEX_ADD_CASE_EXPENSE_ERROR,
  errorMessage: message,
});

export function addCaseExpense(
  article: Macroparameter,
  caseGroup: OPEXGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAddCaseExpenseInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {createOpexCaseExpense(` +
            `caseId: ${caseGroup.id},` +
            `caption: "${article.caption?.toString()}",` +
            `unit: "${article.unit?.toString()}",` +
            `){opexExpense{id,name,caption,unit,valueTotal,value{year,value}}, ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(
          OPEXAddCaseExpenseSuccess(caseGroup, body.data?.createOpexCaseExpense?.opexExpense),
        );
      } else {
        dispatch(OPEXAddCaseExpenseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAddCaseExpenseError(e));
    }
  };
}
