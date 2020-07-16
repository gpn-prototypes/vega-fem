import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Capex } from '../CAPEX/Capex';
import { Macroparameters } from '../macroparameters/Macroparameters';
import { MiningProfile } from '../mining-profile/MiningProfile';
import { NoPageFound } from '../nopagefound/NoPageFound';
import { Opex } from '../OPEX/Opex';
import { Prices } from '../prices/Prices';
import { TaxEnvironment } from '../tax-environment/TaxEnvironment';

export const Main = (): React.ReactElement => (
  <Switch>
    <Route exact path="/" component={Macroparameters} />
    <Route exact path="/tax-environment" component={TaxEnvironment} />
    <Route exact path="/prices" component={Prices} />
    <Route exact path="/OPEX" component={Opex} />
    <Route exact path="/CAPEX" component={Capex} />
    <Route exact path="/mining-profile" component={MiningProfile} />
    <Route component={NoPageFound} />
  </Switch>
);
