import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { CapexesAction } from './fetchCAPEX';

import { CREATE_CAPEX_EXPENSE_GROUP } from '@/api/capex/mutations';
import { mutate } from '@/api/graphql-request';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';

export const CAPEX_EXPENSE_GROUP_ADD_INIT = 'CAPEX_EXPENSE_GROUP_ADD_INIT';
export const CAPEX_EXPENSE_GROUP_ADD_SUCCESS = 'CAPEX_EXPENSE_GROUP_ADD_SUCCESS';
export const CAPEX_EXPENSE_GROUP_ADD_ERROR = 'CAPEX_EXPENSE_GROUP_ADD_ERROR';

const capexExpenseSetGroupAddInitialized = (): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_ADD_INIT,
});

const capexExpenseGroupAddSuccess = (capexSet: CapexExpenseSetGroup): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_ADD_SUCCESS,
  payload: capexSet,
});

const capexExpenseGroupAddError = (message: any): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_ADD_ERROR,
  errorMessage: message,
});

export const createCapexExpenseGroup = (
  newCapexSetGroup: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexExpenseSetGroupAddInitialized());

    mutate({
      query: CREATE_CAPEX_EXPENSE_GROUP,
      variables: {
        caption: newCapexSetGroup.caption,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const createdCapexGroup = response.data?.createCapexExpenseGroup;

        if (createdCapexGroup && createdCapexGroup?.capexExpenseGroup.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          const newGroup = createdCapexGroup?.capexExpenseGroup;

          if (newGroup)
            dispatch(
              capexExpenseGroupAddSuccess({
                ...newGroup,
                ...{ valueTotal: 0 },
                ...{ capexExpenseList: [] },
              } as CapexExpenseSetGroup),
            );
        } else {
          dispatch(capexExpenseGroupAddError('Error'));
        }
      })
      .catch((e) => {
        dispatch(capexExpenseGroupAddError(e));
      });
  };
};
