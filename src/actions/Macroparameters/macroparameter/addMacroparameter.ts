import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from '../macroparameterSetList';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
import Article from '@/types/Article';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const MACROPARAM_ADD_INIT = 'MACROPARAM_ADD_INIT';
export const MACROPARAM_ADD_SUCCESS = 'MACROPARAM_ADD_SUCCESS';
export const MACROPARAM_ADD_ERROR = 'MACROPARAM_ADD_ERROR';

const macroparameterAddInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_ADD_INIT,
});

const macroparameterAddSuccess = (
  macroparameter: Article,
  group: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: MACROPARAM_ADD_SUCCESS,
  payload: { macroparameter, group },
});

const macroparameterAddError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_ADD_ERROR,
  errorMessage: message,
});

export const requestAddMacroparameter = (
  newMacroparameter: Article,
  group: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterAddInitialized());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation createMacroparameter {
            project(version: ${currentVersionFromSessionStorage()}) {
              __typename
              ... on Error {
                code,
                message
              }
              ... on ProjectMutation {
                createMacroparameter(
                  macroparameterSetId:${selected.id.toString()}
                  macroparameterGroupId:${group?.id?.toString()}
                  caption: "${newMacroparameter.caption}"
                  unit: "${newMacroparameter.unit}"
                ) {
                  macroparameter {
                    __typename
                    ... on Macroparameter {
                      id
                      name
                      caption
                      unit
                      value {
                        year
                        value
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
      const responseData = body?.data?.project?.createMacroparameter;

      if (response.status === 200 && responseData?.macroparameter?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        const macroparameter = responseData?.macroparameter;

        if (macroparameter) {
          dispatch(macroparameterAddSuccess(macroparameter as Article, group));
        }
      } else {
        dispatch(macroparameterAddError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterAddError(e));
    }
  };
};
