import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Capex } from '../CAPEX/Capex';
import { MacroparametersTab } from '../MacroparametersTab/MacroparametersTab';
import { MiningProfile } from '../MiningProfile/MiningProfile';
import { NoPageFound } from '../nopagefound/NoPageFound';
import { Opex } from '../OPEX/Opex';
import { Prices } from '../Prices/Prices';
import { TaxEnvironment } from '../TaxEnvironment/TaxEnvironment';

export const Main = (): React.ReactElement => (
  <Switch>
    <Route exact path="/" component={MacroparametersTab} />
    <Route exact path="/tax-environment" component={TaxEnvironment} />
    <Route exact path="/prices" component={Prices} />
    <Route exact path="/OPEX" component={Opex} />
    <Route exact path="/CAPEX" component={Capex} />
    <Route exact path="/mining-profile" component={MiningProfile} />
    <Route component={NoPageFound} />
  </Switch>
);
