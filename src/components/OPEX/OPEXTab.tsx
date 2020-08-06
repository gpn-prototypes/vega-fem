import React from 'react';

import { OPEXContainer } from '../../containers/OPEX/OPEXContainer';
import { OPEXRoleListContainer } from '../../containers/OPEX/OPEXRoleListContainer';
import { cnMacroparametersTab } from '../MacroparametersTab/cn-macroparameter-tab';

export const OPEXTab = (): React.ReactElement => (
  <div className={cnMacroparametersTab()}>
    <OPEXRoleListContainer />
    <OPEXContainer />
  </div>
);
