import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

export const OPEX_MKOS_CHANGE_INIT = 'OPEX_MKOS_CHANGE_INIT';
export const OPEX_MKOS_CHANGE_SUCCESS = 'OPEX_MKOS_CHANGE_SUCCESS';
export const OPEX_MKOS_CHANGE_ERROR = 'OPEX_MKOS_CHANGE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXMKOSChangeInit = (): OPEXAction => ({
  type: OPEX_MKOS_CHANGE_INIT,
});

const OPEXMKOSChangeSuccess = (mkos: OPEXGroup): OPEXAction => ({
  type: OPEX_MKOS_CHANGE_SUCCESS,
  payload: mkos,
});

const OPEXMKOSChangeError = (message: any): OPEXAction => ({
  type: OPEX_MKOS_CHANGE_ERROR,
  errorMessage: message,
});

export function MKOSChange(MKOS: OPEXGroup): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXMKOSChangeInit());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation changeOpexMkos {
            project(version: ${currentVersionFromSessionStorage()}) {
              __typename
              ... on Error {
                code,
                message
              }
              ... on ProjectMutation {
                changeOpexMkos(yearEnd: ${MKOS.yearEnd.toString()}) {
                  mkos {
                    __typename
                    ... on OpexExpenseGroup {
                      yearStart,
                      yearEnd,
                      opexExpenseList {
                        __typename
                        ... on OpexExpenseList {
                          opexExpenseList {
                            id,
                            name,
                            caption,
                            unit,
                            valueTotal,
                            description,
                            value {
                              year,
                              value
                            }
                          }
                        }
                        ... on Error {
                          code
                          message
                          details
                          payload
                        }
                      }
                    }
                    ... on Error {
                      code
                      message
                      details
                      payload
                    }
                  }
                }
              }
            }
          }`,
        }),
      });
      const body = await response.json();

      if (
        response.status === 200 &&
        body.data?.project?.changeOpexMkos?.mkos?.__typename !== 'Error'
      ) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXMKOSChangeSuccess(body.data?.project?.changeOpexMkos?.mkos));
      } else {
        dispatch(OPEXMKOSChangeError(body.message));
      }
    } catch (e) {
      dispatch(OPEXMKOSChangeError(e));
    }
  };
}
