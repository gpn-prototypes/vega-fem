import React from 'react';

import { OPEXContainer } from '../../containers/OPEXContainer';
import { cnMacroparametersTab } from '../MacroparametersTab/cn-macroparameter-tab';

export const OPEXTab = (): React.ReactElement => (
  <div className={cnMacroparametersTab()}>
    <>Menu</>
    <OPEXContainer />
  </div>
);
