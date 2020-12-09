import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationList } from '@gpn-prototypes/vega-ui';

import MacroparameterSet from '../../../../types/Macroparameters/MacroparameterSet';
import keyGen from '../../../helpers/keyGenerator';

export interface MacroparameterSetListProps {
  macroparameterSetList: MacroparameterSet[];
  chooseMacroparameterSet: (set: any) => void;
}

export const MacroparameterSetList = ({
  macroparameterSetList,
  chooseMacroparameterSet,
}: MacroparameterSetListProps) => {
  const selectedSelector = (state: any) => state.macroparamsReducer.selected;
  const selected = useSelector(selectedSelector);

  const scenarioList = macroparameterSetList?.map(
    (macroparameterSet: MacroparameterSet, index: number) => (
      <NavigationList.Item key={keyGen(index)} active={selected?.id === macroparameterSet.id}>
        {(props) => (
          <button
            type="button"
            onClick={() => {
              chooseMacroparameterSet(macroparameterSet);
            }}
            {...props}
          >
            {macroparameterSet?.caption}
          </button>
        )}
      </NavigationList.Item>
    ),
  );

  return (
    <div>
      <NavigationList>{macroparameterSetList?.length > 0 && scenarioList}</NavigationList>
    </div>
  );
};
