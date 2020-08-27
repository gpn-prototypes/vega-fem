import React from 'react';

import { CapexSetContainer } from '../../../containers/CAPEX/CapexSetContainer';

import { cnCapexTab } from './cn-capex-tab';

import './CapexTab.css';

export const CapexTab = (): React.ReactElement => (
  <div className={cnCapexTab()}>
    <div />
    {/* TODO: nav in future */}
    <CapexSetContainer />
  </div>
);
