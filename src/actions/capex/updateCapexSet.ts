import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexSet from '../../../types/CapexSet';
import { authHeader } from '../../helpers/authTokenToLocalstorage';

import { CapexesAction } from './capexSet';

export const CAPEX_SET_UPDATE_INIT = 'CAPEX_SET_UPDATE_INIT';
export const CAPEX_SET_UPDATE_SUCCESS = 'CAPEX_SET_UPDATE_SUCCESS';
export const CAPEX_SET_UPDATE_ERROR = 'CAPEX_SET_UPDATE_ERROR';

const capexSetUpdateInitialized = (): CapexesAction => ({
  type: CAPEX_SET_UPDATE_INIT,
  payload: {} as CapexSet,
});

const capexSetUpdateSuccess = (capexSet: CapexSet): CapexesAction => ({
  type: CAPEX_SET_UPDATE_SUCCESS,
  payload: capexSet,
});

const capexSetUpdateError = (message: any): CapexesAction => ({
  type: CAPEX_SET_UPDATE_ERROR,
  payload: message,
});

export const updateCapexSet = (
  newCapexSet: CapexSet,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.capexReducer;
    dispatch(capexSetUpdateInitialized());

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
            `changeCapexExpenseGroup(` +
            `capexExpenseGroupId:${selected.id.toString()},` +
            `caption:""` +
            `){capexExpenseGroup{id,caption}, ok}` +
            `}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(
          capexSetUpdateSuccess({
            ...selected,
            ...newCapexSet,
          } as CapexSet),
        );
      } else {
        dispatch(capexSetUpdateError(body.message));
      }
    } catch (e) {
      dispatch(capexSetUpdateError(e));
    }
  };
};
