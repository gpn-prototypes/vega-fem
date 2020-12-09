import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CapexTab } from '../CAPEX/CapexTab/CapexTab';
import { MacroparametersTab } from '../Macroparameters/MacroparametersTab/MacroparametersTab';
import { MiningProfile } from '../MiningProfile/MiningProfile';
import { NoPageFound } from '../nopagefound/NoPageFound';
import { OPEXTab } from '../OPEX/OPEXTab';
import { Prices } from '../Prices/Prices';
import { TaxEnvironment } from '../TaxEnvironment/TaxEnvironment';

const basename = '/projects/show/:projectId/fem';

export const Main = (): React.ReactElement => (
  <Switch>
    <Route exact path={`${basename}`} component={MacroparametersTab} />
    <Route exact path={`${basename}/tax-environment`} component={TaxEnvironment} />
    <Route exact path={`${basename}/prices`} component={Prices} />
    <Route exact path={`${basename}/OPEX`} component={OPEXTab} />
    <Route exact path={`${basename}/CAPEX`} component={CapexTab} />
    <Route exact path={`${basename}/mining-profile`} component={MiningProfile} />
    <Route component={NoPageFound} />
  </Switch>
);
