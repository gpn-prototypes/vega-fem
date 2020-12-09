import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from './macroparameterSetList';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const MACROPARAM_SET_GROUP_CHANGE_INIT = 'MACROPARAM_SET_GROUP_CHANGE_INIT';
export const MACROPARAM_SET_GROUP_CHANGE_SUCCESS = 'MACROPARAM_SET_GROUP_CHANGE_SUCCESS';
export const MACROPARAM_SET_GROUP_CHANGE_ERROR = 'MACROPARAM_SET_GROUP_CHANGE_ERROR';

const macroparameterSetGroupChangeInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_CHANGE_INIT,
});

const macroparameterSetGroupChangeSuccess = (
  macroparameterSet: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_CHANGE_SUCCESS,
  payload: macroparameterSet,
});

const macroparameterSetGroupChangeError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_CHANGE_ERROR,
  errorMessage: message,
});

export const changeMacroparameterSetGroup = (
  newMacroparameterSetGroup: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterSetGroupChangeInitialized());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation {
              changeMacroparameterGroup(
              macroparameterSetId:"${selected.id.toString()}"
              macroparameterGroupId:"${newMacroparameterSetGroup.id}"
              caption:"${newMacroparameterSetGroup.caption}"
              version:${currentVersionFromSessionStorage()}){
                macroparameterGroup{
                  __typename
                  ... on MacroparameterGroup{
                    name
                    id
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
      const responseData = body?.data?.changeMacroparameterGroup;

      if (response.ok && responseData?.macroparameterGroup?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        const newGroup = responseData?.macroparameterGroup;

        if (newGroup) {
          dispatch(macroparameterSetGroupChangeSuccess({ ...newGroup } as MacroparameterSetGroup));
        }
      } else {
        dispatch(macroparameterSetGroupChangeError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterSetGroupChangeError(e));
    }
  };
};
