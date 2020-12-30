import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

export const OPEX_AUTOEXPORT_REMOVE_INIT = 'OPEX_AUTOEXPORT_REMOVE_INIT';
export const OPEX_AUTOEXPORT_REMOVE_SUCCESS = 'OPEX_AUTOEXPORT_REMOVE_SUCCESS';
export const OPEX_AUTOEXPORT_REMOVE_ERROR = 'OPEX_AUTOEXPORT_REMOVE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAutoexportRemoveInit = (): OPEXAction => ({
  type: OPEX_AUTOEXPORT_REMOVE_INIT,
});

const OPEXAutoexportRemoveSuccess = (autoexport: OPEXGroup): OPEXAction => ({
  type: OPEX_AUTOEXPORT_REMOVE_SUCCESS,
  payload: autoexport,
});

const OPEXAutoexportRemoveError = (message: any): OPEXAction => ({
  type: OPEX_AUTOEXPORT_REMOVE_ERROR,
  errorMessage: message,
});

export function autoexportRemove(
  autoexport: OPEXGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAutoexportRemoveInit());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation removeOpexAutoexport{
              removeOpexAutoexport(version:${currentVersionFromSessionStorage()} ){
                __typename
                ...on Error{
                  code
                  message
                  details
                  payload
                }
              }
            }`,
        }),
      });
      const body = await response.json();
      const responseData = body?.data?.removeOpexAutoexport;

      if (response.status === 200 && responseData?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXAutoexportRemoveSuccess(autoexport));
      } else {
        dispatch(OPEXAutoexportRemoveError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAutoexportRemoveError(e));
    }
  };
}
