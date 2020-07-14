import React from 'react';
import { MacroparameterSetContainer } from '../../containers/MacroparameterSetContainer';
import { ScenarioListContainer } from '../../containers/ScenarioListContainer';

export const Macroparameters = (): React.ReactElement => <div>
  <ScenarioListContainer />
  <MacroparameterSetContainer />
</div>;
