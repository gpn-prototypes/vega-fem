import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
import OPEXSetType from '@/types/OPEX/OPEXSetType';

export const OPEX_SET_CHANGE_INIT = 'OPEX_SET_CHANGE_INIT';
export const OPEX_SET_CHANGE_SUCCESS = 'OPEX_SET_CHANGE_SUCCESS';
export const OPEX_SET_CHANGE_ERROR = 'OPEX_SET_CHANGE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXSetChangeInit = (): OPEXAction => ({
  type: OPEX_SET_CHANGE_INIT,
});

const OPEXSetChangeSuccess = (OPEXSetInstance: OPEXSetType): OPEXAction => ({
  type: OPEX_SET_CHANGE_SUCCESS,
  payload: OPEXSetInstance,
});

const OPEXSetChangeError = (message: any): OPEXAction => ({
  type: OPEX_SET_CHANGE_ERROR,
  errorMessage: message,
});

export function changeOPEXSet(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  // TODO: что это за запрос? Его надо менять?
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXSetChangeInit());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `{
            project {
              opex {
                hasAutoexport,
                autoexport {
                  yearStart,
                  yearEnd,
                  opexExpenseList {
                    id,
                    name,
                    caption,
                    unit,
                    valueTotal,
                    value {
                      year,
                      value
                    }
                  }
                },
                hasMkos,
                mkos {
                  yearStart,
                  yearEnd,
                  opexExpenseList {
                    id,
                    name,
                    caption,
                    unit,
                    valueTotal,
                    value {
                      year,
                      value
                    }
                  }
                },
                opexCaseList {
                  yearStart,
                  yearEnd,
                  id,
                  name,
                  caption,
                  opexExpenseList {
                    id,
                    name,
                    caption,
                    unit,
                    valueTotal,
                    value {
                      year,
                      value
                    }
                  }
                }
              }
            }
          }`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(OPEXSetChangeSuccess(body.data?.project?.opex));
      } else {
        dispatch(OPEXSetChangeError(body.message));
      }
    } catch (e) {
      dispatch(OPEXSetChangeError(e));
    }
  };
}
