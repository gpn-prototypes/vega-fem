import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
import CapexSet from '@/types/CAPEX/CapexSet';

export const CAPEX_FETCH = 'CAPEX_FETCH';
export const CAPEX_SUCCESS = 'CAPEX_SUCCESS';
export const CAPEX_ERROR = 'CAPEX_ERROR';

export interface CapexesAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const capexFetch = (): CapexesAction => ({
  type: CAPEX_FETCH,
});

const capexSuccess = (capex: CapexSet): CapexesAction => ({
  type: CAPEX_SUCCESS,
  payload: capex,
});

const capexError = (message: any): CapexesAction => ({
  type: CAPEX_ERROR,
  errorMessage: message,
});

export function fetchCapex(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexFetch());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `{
                capex{
                  __typename
                  ... on Capex{
                    years
                    yearStart
                    capexGlobalValueList{
                      __typename
                      ... on CapexGlobalValueList{
                        capexGlobalValueList{
                          id
                          name
                          unit
                          caption
                          value
                        }
                      }
                      ... on Error{
                        code
                        message
                      }
                    },
                    capexExpenseGroupList{
                      __typename
                      ...on CapexExpenseGroupList{
                        capexExpenseGroupList{
                          id
                          name
                          caption
                          valueTotal
                          createdAt
                          totalValueByYear{
                            year
                            value
                          }
                          capexExpenseList{
                            __typename
                            ... on CapexExpenseList{
                                capexExpenseList{
                                    id
                                    name
                                    caption
                                    unit
                                    valueTotal
                                    createdAt
                                    value{
                                        year
                                        value
                                    }
                                }
                            }
                            ...on Error{
                                code
                                message
                            }
                          }
                        }
                      }
                      ...on Error{
                        code
                        message
                      }
                    }
                  }
                  ... on Error{
                  code
                  message
                  }
                }
              }`,
        }),
      });
      const body = await response.json();

      if (response.status === 200) {
        dispatch(capexSuccess(body.data?.capex));
      } else {
        dispatch(capexError(body.message));
      }
    } catch (e) {
      dispatch(capexError(e));
    }
  };
}
