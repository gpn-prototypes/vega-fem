import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexExpense from '../../../types/CapexExpense';
import CapexExpenseSetGroup from '../../../types/CapexExpenseSetGroup';
import { authHeader } from '../../helpers/authTokenToLocalstorage';

import { CapexesAction } from './capexSet';

export const ADD_CAPEX_INIT = 'ADD_CAPEX_INIT';
export const ADD_CAPEX_SUCCESS = 'ADD_CAPEX_SUCCESS';
export const ADD_CAPEX_ERROR = 'ADD_CAPEX_ERROR';

const capexAddInitialized = (): CapexesAction => ({
  type: ADD_CAPEX_INIT,
});

const capexAddSuccess = (capex: CapexExpense, group: CapexExpenseSetGroup): CapexesAction => ({
  type: ADD_CAPEX_SUCCESS,
  payload: { capex, group },
});

const capexAddError = (message: any): CapexesAction => ({
  type: ADD_CAPEX_ERROR,
  errorMessage: message,
});

export const requestAddCapex = (
  newCapexExpense: CapexExpense,
  group: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexAddInitialized());

    try {
      const response = await fetch('graphql/5edde72c45eb7b93ad30c0c3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify({
          query:
            `mutation {` +
            `createCapexExpense(` +
            `capexExpenseGroupId:"${group.id?.toString()}",` +
            `caption:"${newCapexExpense.caption}",` +
            `unit:"${newCapexExpense.unit}",` +
            `){capexExpense{id, name, caption, unit, value{year,value}}, ok}}` /* это возвращаемые значения */,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.createCapexExpense;

      if (response.ok && responseData?.ok) {
        const capex = responseData?.capexExpense;

        if (capex) {
          dispatch(capexAddSuccess(capex as CapexExpense, group));
        }
      } else {
        dispatch(capexAddError(body.message));
      }
    } catch (e) {
      dispatch(capexAddError(e));
    }
  };
};
