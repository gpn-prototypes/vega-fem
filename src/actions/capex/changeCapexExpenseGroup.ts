import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexExpenseSetGroup from '../../../types/CAPEX/CapexExpenseSetGroup';
import { currentVersionFromSessionStorage } from '../../helpers/currentVersionFromSessionStorage';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { CapexesAction } from './fetchCAPEX';

export const CAPEX_EXPENSE_GROUP_CHANGE_INIT = 'CAPEX_EXPENSE_GROUP_CHANGE_INIT';
export const CAPEX_EXPENSE_GROUP_CHANGE_SUCCESS = 'CAPEX_EXPENSE_GROUP_CHANGE_SUCCESS';
export const CAPEX_EXPENSE_GROUP_CHANGE_ERROR = 'CAPEX_EXPENSE_GROUP_CHANGE_ERROR';

const capexExpenseGroupChangeInitialized = (): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_CHANGE_INIT,
});

const capexExpenseGroupChangeSuccess = (capexSet: CapexExpenseSetGroup): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_CHANGE_SUCCESS,
  payload: capexSet,
});

const capexExpenseGroupChangeError = (message: any): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_CHANGE_ERROR,
  errorMessage: message,
});

export const changeCapexExpenseGroup = (
  capexSetGroup: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexExpenseGroupChangeInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation changeCapexExpenseGroup{
              changeCapexExpenseGroup(
                capexExpenseGroupId:"${capexSetGroup.id}",
                caption:"${capexSetGroup.caption}"
              version: ${currentVersionFromSessionStorage()}
              ){
                capexExpenseGroup{
                  __typename
                  totalValueByYear{
                    year
                    value
                  }
                  ... on CapexExpenseGroup{
                    id,
                    caption
                  }
                  ...on Error{
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
      const changedCapexGroup = body?.data?.changeCapexExpenseGroup;

      if (response.status === 200 && changedCapexGroup?.capexExpenseGroup.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        const newGroup = changedCapexGroup?.capexExpenseGroup;
        if (newGroup) console.log(newGroup);
        dispatch(capexExpenseGroupChangeSuccess({ ...newGroup } as CapexExpenseSetGroup));
      } else {
        dispatch(capexExpenseGroupChangeError(body.message));
      }
    } catch (e) {
      dispatch(capexExpenseGroupChangeError(e));
    }
  };
};
