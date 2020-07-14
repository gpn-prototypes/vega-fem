import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MacroparameterSet from '../../types/MacroparameterSet';

import { fetchScenariosList, selectScenario } from '../actions/macroparametersSetList';
import { ScenarioList } from '../components/ScenarioList/ScenarioList';

export const ScenarioListContainer = () => {
  const dispatch = useDispatch();

  /* TODO: describe state interface */
  const selectScenarios = (state: any) => state.macroparamsReducer.macroparameterSetList;
  const scenarios: MacroparameterSet[] = useSelector(selectScenarios);

  useEffect(() => {
    dispatch(fetchScenariosList());
  }, [dispatch]);

  const selectMacroparameterSet = useCallback(
    (set: any) => {
      dispatch(selectScenario(set));
    },
    [dispatch],
  );

  return <ScenarioList scenarios={scenarios} click={selectMacroparameterSet} />;
};
