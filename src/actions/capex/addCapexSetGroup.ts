import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexExpenseSetGroup from '../../../types/CapexExpenseSetGroup';
import { authHeader } from '../../helpers/authTokenToLocalstorage';

import { CapexesAction } from './capexSet';

export const CAPEX_SET_GROUP_ADD_INIT = 'CAPEX_SET_GROUP_ADD_INIT';
export const CAPEX_SET_GROUP_ADD_SUCCESS = 'CAPEX_SET_GROUP_ADD_SUCCESS';
export const CAPEX_SET_GROUP_ADD_ERROR = 'CAPEX_SET_GROUP_ADD_ERROR';

const capexSetGroupAddInitialized = (): CapexesAction => ({
  type: CAPEX_SET_GROUP_ADD_INIT,
});

const capexSetGroupAddSuccess = (capexSet: CapexExpenseSetGroup): CapexesAction => ({
  type: CAPEX_SET_GROUP_ADD_SUCCESS,
  payload: capexSet,
});

const capexSetGroupAddError = (message: any): CapexesAction => ({
  type: CAPEX_SET_GROUP_ADD_ERROR,
  errorMessage: message,
});

export const addCapexSetGroup = (
  newCapexSetGroup: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    // const { selected } = getState()?.capexReducer;
    dispatch(capexSetGroupAddInitialized());

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
            `mutation {createCapexExpenseGroup(` +
            `caption: "${newCapexSetGroup.caption}", ` +
            `){capexExpenseGroup{id, caption}, ok}}`,
        }),
      });

      const body = await response.json();
      const createdCapexGroup = body?.data?.createCapexExpenseGroup;

      if (response.ok && createdCapexGroup?.ok) {
        const newGroup = createdCapexGroup?.capexExpenseGroup;

        if (newGroup)
          dispatch(
            capexSetGroupAddSuccess({ ...newGroup, ...{ capexList: [] } } as CapexExpenseSetGroup),
          );
      } else {
        dispatch(capexSetGroupAddError(body.message));
      }
    } catch (e) {
      dispatch(capexSetGroupAddError(e));
    }
  };
};
