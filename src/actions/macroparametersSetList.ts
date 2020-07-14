import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import MacroparameterSet from '../../types/MacroparameterSet';


export const MACROPARAMS_SET_LIST_FETCH = 'MACROPARAMS_SET_LIST_FETCH';
export const MACROPARAMS_SET_LIST_SUCCESS = 'MACROPARAMS_SET_LIST_SUCCESS';
export const MACROPARAMS_SET_LIST_ERROR = 'MACROPARAMS_SET_LIST_ERROR';

export const MACROPARAMS_SET_SELECTED = 'MACROPARAMS_SET_SELECTED';

export interface MacroparamsAction {
  type: string;
  // TODO: replace any
  payload: any;
}

const scenariosFetch = (): MacroparamsAction => ({
  type: MACROPARAMS_SET_LIST_FETCH,
  payload: [] as MacroparameterSet[],
});

const scenariosSuccess = (scenariosList: MacroparameterSet[]): MacroparamsAction => ({
  type: MACROPARAMS_SET_LIST_SUCCESS,
  payload: scenariosList,
});

const scenariosError = (massage: any): MacroparamsAction => ({
  type: MACROPARAMS_SET_LIST_ERROR,
  payload: massage,
});

export function fetchScenariosList(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(scenariosFetch());

    try {
      const response = await fetch('graphql/5edde72c45eb7b93ad30c0c3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query:
            '{macroparameterSetList{id,name,caption,years,category,macroparameterGroupList{id,name,caption,macroparameterList{id,name,caption,value{year,value}}}}}',
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(scenariosSuccess(body.data?.macroparameterSetList));
      } else {
        dispatch(scenariosError(body.message));
      }
    } catch (e) {
      dispatch(scenariosError(e));
    }
  };
}

export const selectScenario = (scenario: MacroparameterSet): MacroparamsAction => ({
  type: MACROPARAMS_SET_SELECTED,
  payload: scenario,
});
