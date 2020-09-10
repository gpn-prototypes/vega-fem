import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CapexTab } from '../CAPEX/CapexTab/CapexTab';
import { MacroparametersTab } from '../Macroparameters/MacroparametersTab/MacroparametersTab';
import { MiningProfile } from '../MiningProfile/MiningProfile';
import { NoPageFound } from '../nopagefound/NoPageFound';
import { OPEXTab } from '../OPEX/OPEXTab';
import { Prices } from '../Prices/Prices';
import { TaxEnvironment } from '../TaxEnvironment/TaxEnvironment';

export const Main = (): React.ReactElement => (
  <Switch>
    <Route exact path="/" component={MacroparametersTab} />
    <Route exact path="/tax-environment" component={TaxEnvironment} />
    <Route exact path="/prices" component={Prices} />
    <Route exact path="/OPEX" component={OPEXTab} />
    <Route exact path="/CAPEX" component={CapexTab} />
    <Route exact path="/mining-profile" component={MiningProfile} />
    <Route component={NoPageFound} />
  </Switch>
);
