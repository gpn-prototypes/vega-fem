import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article, { ArticleValues } from '../../../types/Article';
import CapexExpenseSetGroup from '../../../types/CAPEX/CapexExpenseSetGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { CapexesAction } from './capexSet';

export const CAPEX_UPDATE_VALUE_INIT = 'CAPEX_UPDATE_VALUE_INIT';
export const CAPEX_UPDATE_VALUE_SUCCESS = 'CAPEX_UPDATE_VALUE_SUCCESS';
export const CAPEX_UPDATE_VALUE_ERROR = 'CAPEX_UPDATE_VALUE_ERROR';

const capexUpdateValueInitialized = (): CapexesAction => ({
  type: CAPEX_UPDATE_VALUE_INIT,
});

const capexUpdateValueSuccess = (
  capex: Article,
  group: CapexExpenseSetGroup,
  groupTotalValueByYear: ArticleValues[],
): CapexesAction => ({
  type: CAPEX_UPDATE_VALUE_SUCCESS,
  payload: { capex, group, groupTotalValueByYear },
});

const capexUpdateValueError = (message: any): CapexesAction => ({
  type: CAPEX_UPDATE_VALUE_ERROR,
  errorMessage: message,
});

export const requestUpdateCapexValue = (
  capex: Article,
  group: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexUpdateValueInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {changeCapexExpense(` +
            `capexExpenseGroupId: ${group?.id?.toString()},` +
            `capexExpenseId: ${capex.id},` +
            `value: ${capex.value}` +
            `){capexExpense{name, id, caption, valueTotal, unit, value{year,value}}, ok, totalValueByYear{year,value}}}`,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.changeCapexExpense;
      const groupTotalValueByYear = responseData?.totalValueByYear;

      if (response.ok && responseData?.ok) {
        const newCapex = responseData?.capexExpense;

        if (newCapex) {
          dispatch(capexUpdateValueSuccess(newCapex as Article, group, groupTotalValueByYear));
        }
      } else {
        dispatch(capexUpdateValueError(body.message));
      }
    } catch (e) {
      dispatch(capexUpdateValueError(e));
    }
  };
};
