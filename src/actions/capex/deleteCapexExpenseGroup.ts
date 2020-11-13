import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexExpenseSetGroup from '../../../types/CAPEX/CapexExpenseSetGroup';
import { currentVersionFromSessionStorage } from '../../helpers/currentVersionFromSessionStorage';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { CapexesAction } from './fetchCAPEX';

export const CAPEX_EXPENSE_GROUP_DELETE_INIT = 'CAPEX_EXPENSE_GROUP_DELETE_INIT';
export const CAPEX_EXPENSE_GROUP_DELETE_SUCCESS = 'CAPEX_EXPENSE_GROUP_DELETE_SUCCESS';
export const CAPEX_EXPENSE_GROUP_DELETE_ERROR = 'CAPEX_EXPENSE_GROUP_DELETE_ERROR';

const capexExpenseGroupDeleteInitialized = (): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_DELETE_INIT,
});

const capexExpenseGroupDeleteSuccess = (capexSet: CapexExpenseSetGroup): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_DELETE_SUCCESS,
  payload: capexSet,
});

const capexExpenseGroupDeleteError = (message: any): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_DELETE_ERROR,
  errorMessage: message,
});

export const deleteCapexExpenseGroup = (
  capexSetGroup: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexExpenseGroupDeleteInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation deleteCapexExpenseGroup{
            deleteCapexExpenseGroup(
              capexExpenseGroupId:"${capexSetGroup.id}",
              version:${currentVersionFromSessionStorage()}
            ){
              result{
                __typename
                ...on Result{
                  vid
                }
                ... on Error{
                  code
                  message
                }
              }
            }
          }`,
        }),
      });

      const body = await response.json();

      if (
        response.status === 200 &&
        body.data.deleteCapexExpenseGroup?.result.__typename !== 'Error'
      ) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(capexExpenseGroupDeleteSuccess(capexSetGroup));
      } else {
        dispatch(capexExpenseGroupDeleteError(body.message));
      }
    } catch (e) {
      dispatch(capexExpenseGroupDeleteError(e));
    }
  };
};
