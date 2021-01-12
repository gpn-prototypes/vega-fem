import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { CapexesAction } from '../fetchCAPEX';

import { UPDATE_CAPEX_SET_GLOBAL_VALUE } from '@/api/capex';
import { mutate } from '@/api/graphql-request';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { roundDecimal2Digits } from '@/helpers/roundDecimal2Digits';
import CapexSetGlobalValue from '@/types/CAPEX/CapexSetGlobalValue';

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

    mutate({
      query: UPDATE_CAPEX_SET_GLOBAL_VALUE,
      variables: {
        capexGlobalValueId: `${globalValue?.id}`,
        value: roundDecimal2Digits(globalValue?.value ?? 0),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.updateCapexGlobalValue;

        if (responseData && responseData?.capexGlobalValue?.__typename !== 'Error') {
          const capexGlobalValue = responseData?.capexGlobalValue;

          if (capexGlobalValue) {
            sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
            dispatch(capexUpdateGlobalValueSuccess(capexGlobalValue as CapexSetGlobalValue));
          }
        } else if (responseData?.capexGlobalValue?.__typename === 'Error') {
          dispatch(capexUpdateGlobalValueError(responseData?.capexGlobalValue));
        }
      })
      .catch((e) => {
        dispatch(capexUpdateGlobalValueError(e));
      });
  };
};
