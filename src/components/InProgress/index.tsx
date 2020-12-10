import React, { useState } from 'react';
import { Item } from '@consta/uikit/SnackBar';
import { IconProcessing, SnackBar } from '@gpn-prototypes/vega-ui';

import { cnInProgress } from './cn-in-progress';

import './index.css';

export const InProgress = (): React.ReactElement => {
  const [items, setItems] = useState<Item[]>([
    {
      key: 1,
      message: 'Раздел находится в разработке',
      icon: IconProcessing,
      status: 'warning',
      onClose: (i) => setItems([]),
    },
  ]);

  return (
    <div className={cnInProgress()}>
      <SnackBar className={cnInProgress('SnackBar')} items={items} />
    </div>
  );
};
