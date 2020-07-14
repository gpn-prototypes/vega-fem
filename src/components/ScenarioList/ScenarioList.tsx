import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationList } from '@gpn-prototypes/vega-navigation-list';
import MacroparameterSet from '../../../types/MacroparameterSet';


import { cnScenarioList } from './cn-scenario-list';

interface ScenarioListProps {
  scenarios: MacroparameterSet[];
  click: (set: any) => void;
}

export const ScenarioList = ({ scenarios, click }: ScenarioListProps) => {
  const selectedSelector = (state: any) => state.macroparamsReducer.selected;
  const selected = useSelector(selectedSelector);

  const scenarioList = scenarios?.map((scenario: MacroparameterSet, index: number) => (
    <NavigationList.Item key={index} active={selected?.id === scenario.id}>
      {(props) => (
        <button
          type="button"
          onClick={() => {
            click(scenario);
          }}
          {...props}
        >
          {scenario?.caption}
        </button>
      )}
    </NavigationList.Item>
  ));

  return (
    <div className={cnScenarioList()}>
      <NavigationList>{scenarios?.length > 0 && scenarioList}</NavigationList>
    </div>
  );
};
