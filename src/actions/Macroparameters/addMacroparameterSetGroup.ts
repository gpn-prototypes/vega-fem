import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from './macroparameterSetList';

import { setAlertNotification } from '@/actions/notifications';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const MACROPARAM_SET_GROUP_ADD_INIT = 'MACROPARAM_SET_GROUP_ADD_INIT';
export const MACROPARAM_SET_GROUP_ADD_SUCCESS = 'MACROPARAM_SET_GROUP_ADD_SUCCESS';
export const MACROPARAM_SET_GROUP_ADD_ERROR = 'MACROPARAM_SET_GROUP_ADD_ERROR';

const macroparameterSetGroupAddInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_ADD_INIT,
});

const macroparameterSetGroupAddSuccess = (
  macroparameterSet: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_ADD_SUCCESS,
  payload: macroparameterSet,
});

const macroparameterSetGroupAddError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_ADD_ERROR,
  errorMessage: message,
});

export const addMacroparameterSetGroup = (
  newMacroparameterSetGroup: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterSetGroupAddInitialized());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation createMacroparameterGroup{
            createMacroparameterGroup(
              macroparameterSetId:${selected.toString()}
              caption: "${newMacroparameterSetGroup.caption}"
              name: "${newMacroparameterSetGroup.name}"
              version:${currentVersionFromSessionStorage()}
            ){
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
      const responseData = body?.data?.createMacroparameterGroup;

      if (response.status === 200 && responseData?.macroparameterGroup?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        const newGroup = responseData?.macroparameterGroup;

        if (newGroup) {
          dispatch(
            macroparameterSetGroupAddSuccess({
              ...newGroup,
              ...{ macroparameterList: [] },
            } as MacroparameterSetGroup),
          );
        }
      } else {
        dispatch(macroparameterSetGroupAddError(body.message));
        if (responseData?.macroparameterGroup?.__typename === 'Error') {
          dispatch(setAlertNotification(responseData.macroparameterGroup.message));
        } else {
          dispatch(setAlertNotification('Серверная ошибка'));
        }
      }
    } catch (e) {
      dispatch(macroparameterSetGroupAddError(e));
      dispatch(setAlertNotification('Серверная ошибка'));
    }
  };
};
