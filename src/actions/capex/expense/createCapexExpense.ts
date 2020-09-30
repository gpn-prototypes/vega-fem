import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article from '../../../../types/Article';
import CapexExpenseSetGroup from '../../../../types/CAPEX/CapexExpenseSetGroup';
import headers from '../../../helpers/headers';
import { projectIdFromLocalStorage } from '../../../helpers/projectIdToLocalstorage';
import { CapexesAction } from '../fetchCAPEX';

export const CREATE_CAPEX_EXPENSE_INIT = 'CREATE_CAPEX_EXPENSE_INIT';
export const CREATE_CAPEX_EXPENSE_SUCCESS = 'CREATE_CAPEX_EXPENSE_SUCCESS';
export const CREATE_CAPEX_EXPENSE_ERROR = 'CREATE_CAPEX_EXPENSE_ERROR';

const createCapexExpenseInitialized = (): CapexesAction => ({
  type: CREATE_CAPEX_EXPENSE_INIT,
});

const createCapexExpenseSuccess = (capex: Article, group: CapexExpenseSetGroup): CapexesAction => ({
  type: CREATE_CAPEX_EXPENSE_SUCCESS,
  payload: { capex, group },
});

const createCapexExpenseError = (message: any): CapexesAction => ({
  type: CREATE_CAPEX_EXPENSE_ERROR,
  errorMessage: message,
});

export const requestCreateCapexExpense = (
  newCapexExpense: Article,
  group: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(createCapexExpenseInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation createCapexExpense{
            createCapexExpense(
              capexExpenseGroupId:"${group?.id?.toString()}",
              caption:"${newCapexExpense.caption}",
              unit:"${newCapexExpense.unit}"
            ){
              capexExpense{
                __typename
                ... on CapexExpense{
                  id
                  name
                  caption
                  unit
                  value{
                      year
                      value
                  }
                }
                ... on Error{
                  code
                  message
                  details
                  payload
                }
              }
            }
          }`,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.createCapexExpense;

      if (response.status === 200 && responseData.capexExpense?.__typename !== 'Error') {
        const capex = responseData?.capexExpense;

        if (capex) {
          dispatch(createCapexExpenseSuccess(capex as Article, group));
        }
      } else {
        dispatch(createCapexExpenseError(body.message));
      }
    } catch (e) {
      dispatch(createCapexExpenseError(e));
    }
  };
};
