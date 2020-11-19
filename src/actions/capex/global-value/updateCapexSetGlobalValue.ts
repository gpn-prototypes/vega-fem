import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexSetGlobalValue from '../../../../types/CAPEX/CapexSetGlobalValue';
import { authHeader } from '../../../helpers/authTokenToLocalstorage';
import { currentVersionFromSessionStorage } from '../../../helpers/currentVersionFromSessionStorage';
import { projectIdFromLocalStorage } from '../../../helpers/projectIdToLocalstorage';
import { roundDecimal2Digits } from '../../../helpers/roundDecimal2Digits';
import { CapexesAction } from '../fetchCAPEX';

export const CAPEX_UPDATE_GLOBAL_VALUE_INIT = 'CAPEX_UPDATE_GLOBAL_VALUE_INIT';
export const CAPEX_UPDATE_GLOBAL_VALUE_SUCCESS = 'CAPEX_UPDATE_GLOBAL_VALUE_SUCCESS';
export const CAPEX_UPDATE_GLOBAL_VALUE_ERROR = 'CAPEX_UPDATE_GLOBAL_VALUE_ERROR';

const capexUpdateGlobalValueInitialized = (): CapexesAction => ({
  type: CAPEX_UPDATE_GLOBAL_VALUE_INIT,
});

const capexUpdateGlobalValueSuccess = (globalValue: CapexSetGlobalValue): CapexesAction => ({
  type: CAPEX_UPDATE_GLOBAL_VALUE_SUCCESS,
  payload: globalValue,
});

const capexUpdateGlobalValueError = (message: any): CapexesAction => ({
  type: CAPEX_UPDATE_GLOBAL_VALUE_ERROR,
  errorMessage: message,
});

export const requestUpdateCapexGlobalValue = (
  globalValue: CapexSetGlobalValue,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexUpdateGlobalValueInitialized());

    try {
      /* TODO: set project id dynamically */
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify({
          query: `mutation updateCapexGlobalValue{
              updateCapexGlobalValue(
                capexGlobalValueId:"${globalValue?.id}"
                value: ${roundDecimal2Digits(globalValue?.value ?? 0)}
                version: ${currentVersionFromSessionStorage()}
              ){
                capexGlobalValue{
                  __typename
                  ... on CapexGlobalValue{
                    id
                    name
                    unit
                    value
                    caption
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
      const responseData = body?.data?.updateCapexGlobalValue;

      if (response.ok && responseData?.capexGlobalValue.__typename !== 'Error') {
        const capexGlobalValue = responseData?.capexGlobalValue;

        if (capexGlobalValue) {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(capexUpdateGlobalValueSuccess(capexGlobalValue as CapexSetGlobalValue));
        }
      } else {
        dispatch(capexUpdateGlobalValueError(body.message));
      }
    } catch (e) {
      dispatch(capexUpdateGlobalValueError(e));
    }
  };
};
