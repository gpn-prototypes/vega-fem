import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import OPEXSetType from '../../../types/OPEX/OPEXSetType';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

export const OPEX_SET_FETCH = 'OPEX_SET_FETCH';
export const OPEX_SET_SUCCESS = 'OPEX_SET_SUCCESS';
export const OPEX_SET_ERROR = 'OPEX_SET_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXSetFetchInit = (): OPEXAction => ({
  type: OPEX_SET_FETCH,
});

const OPEXSetSuccess = (OPEXSetInstance: OPEXSetType): OPEXAction => ({
  type: OPEX_SET_SUCCESS,
  payload: OPEXSetInstance,
});

const OPEXSetError = (message: any): OPEXAction => ({
  type: OPEX_SET_ERROR,
  errorMessage: message,
});

export function fetchOPEXSet(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXSetFetchInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `{
              opex{
                __typename
                ... on Opex{
                  sdf,
                  hasAutoexport,
                  hasMkos,
                  autoexport{
                    __typename
                    ... on OpexExpenseGroup{
                      yearStart,
                      yearEnd,
                      opexExpenseList{
                        __typename
                        ... on OpexExpenseList{
                          opexExpenseList{
                            id,
                            name,
                            caption,
                            unit,
                            valueTotal,
                            description,
                            value{
                              year,
                              value
                            }
                          }
                        }
                        ... on Error{
                          code
                          message
                          details
                          payload
                        }
                      }
                    }
                    ... on Error{
                      code
                      message
                      details
                      payload
                    }
                  }
                  mkos{
                    __typename
                    ... on OpexExpenseGroup{
                      yearStart,
                      yearEnd,
                      opexExpenseList{
                        __typename
                        ...on OpexExpenseList{
                          opexExpenseList{
                            id,
                            name,
                            caption,
                            unit,
                            valueTotal,
                            description,
                            value{
                              year,
                              value
                            }
                          }
                        }
                        ... on Error{
                          code
                          message
                          details
                          payload
                        }
                      }
                    }
                    ... on Error{
                      code
                      message
                      details
                      payload
                    }
                  }
                  opexCaseList{
                    __typename
                    ...on OpexExpenseGroupList{
                      opexCaseList{
                        yearStart,
                        yearEnd,
                        id,
                        name,
                        caption,
                        opexExpenseList{
                          __typename
                          ... on OpexExpenseList{
                            opexExpenseList{
                              id,
                              name,
                              caption,
                              unit,
                              valueTotal,
                              value{
                                year,
                                value
                              }
                            }
                          }
                          ... on Error{
                            code
                            message
                            details
                            payload
                          }
                        }
                      }
                    }
                    ... on Error{
                      code
                      message
                      details
                      payload
                    }
                  }
                }
                ... on Error{
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

      if (response.status === 200) {
        dispatch(OPEXSetSuccess(body.data?.opex));
      } else {
        dispatch(OPEXSetError(body.message));
      }
    } catch (e) {
      dispatch(OPEXSetError(e));
    }
  };
}
