import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from '../macroparameterSetList';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
import Article from '@/types/Article';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const MACROPARAM_DELETE_INIT = 'MACROPARAM_DELETE_INIT';
export const MACROPARAM_DELETE_SUCCESS = 'MACROPARAM_DELETE_SUCCESS';
export const MACROPARAM_DELETE_ERROR = 'MACROPARAM_DELETE_ERROR';

const macroparameterDeleteInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_DELETE_INIT,
});

const macroparameterDeleteSuccess = (
  macroparameter: Article,
  group: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: MACROPARAM_DELETE_SUCCESS,
  payload: { macroparameter, group },
});

const macroparameterDeleteError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_DELETE_ERROR,
  errorMessage: message,
});

export const requestDeleteMacroparameter = (
  macroparameter: Article,
  group: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterDeleteInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation deleteMacroparameter{
              deleteMacroparameter(
                macroparameterSetId:"${selected.id.toString()}",
                macroparameterGroupId:"${group?.id?.toString()}",
                macroparameterId:"${macroparameter.id}"
              version:${currentVersionFromSessionStorage()}
            ){
              result{
                 __typename
                 ... on Result{
                   vid
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

      if (response.ok) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(macroparameterDeleteSuccess(macroparameter as Article, group));
      } else {
        dispatch(macroparameterDeleteError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterDeleteError(e));
    }
  };
};
