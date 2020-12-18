import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from './macroparameterSetList';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
import MacroparameterSet from '@/types/Macroparameters/MacroparameterSet';

export const MACROPARAM_SET_UPDATE_INIT = 'MACROPARAM_SET_UPDATE_INIT';
export const MACROPARAM_SET_UPDATE_SUCCESS = 'MACROPARAM_SET_UPDATE_SUCCESS';
export const MACROPARAM_SET_UPDATE_ERROR = 'MACROPARAM_SET_UPDATE_ERROR';

const macroparameterSetUpdateInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_SET_UPDATE_INIT,
  payload: {} as MacroparameterSet,
});

const macroparameterSetUpdateSuccess = (
  macroparameterSet: MacroparameterSet,
): MacroparamsAction => ({
  type: MACROPARAM_SET_UPDATE_SUCCESS,
  payload: macroparameterSet,
});

const macroparameterSetUpdateError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_SET_UPDATE_ERROR,
  payload: message,
});

export const updateMacroparameterSet = (
  newMacroparameterSet: MacroparameterSet,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterSetUpdateInitialized());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation changeMacroparameterSet {
            project(version: ${currentVersionFromSessionStorage()}) {
              __typename
              ... on Error {
                code,
                message
              }
              ... on ProjectMutation {
                changeMacroparameterSet(
                  macroparameterSetId:${selected.id.toString()},
                  category:${newMacroparameterSet.category}
                  caption: "${newMacroparameterSet.caption}"
                  name: "${newMacroparameterSet.name}"
                  years:${newMacroparameterSet.years}
                  yearStart:${newMacroparameterSet.yearStart}
                  allProjects:${newMacroparameterSet.allProjects}
                ) {
                  macroparameterSet {
                    __typename
                    ...on MacroparameterSet {
                      id
                      name
                      caption
                      years
                      yearStart
                      category
                      allProjects
                      macroparameterGroupList {
                        __typename
                        ... on MacroparameterGroupList {
                          macroparameterGroupList {
                            id
                            name
                            caption
                            macroparameterList {
                              __typename
                              ... on MacroparameterList {
                                macroparameterList {
                                  id
                                  name
                                  caption
                                  unit
                                  value {
                                    year
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
      const responseData = body?.data?.project?.changeMacroparameterSet;

      if (response.status === 200 && responseData.macroparameterSet?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(
          macroparameterSetUpdateSuccess(responseData?.macroparameterSet as MacroparameterSet),
        );
      } else {
        dispatch(macroparameterSetUpdateError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterSetUpdateError(e));
    }
  };
};
