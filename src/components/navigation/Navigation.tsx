import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ChoiceGroup } from '@gpn-prototypes/vega-ui';

export interface NavItem {
  title: string;
  path: string;
}

export const Navigation = (): React.ReactElement => {
  const history = useHistory();
  const tabs: Array<NavItem> = [
    {
      title: 'Макромапарметры',
      path: '/',
    },
    {
      title: 'Налоговое окружение',
      path: '/tax-environment',
    },
    {
      title: 'Цены',
      path: '/prices',
    },
    {
      title: 'OPEX',
      path: '/OPEX',
    },
    {
      title: 'CAPEX',
      path: '/CAPEX',
    },
    {
      title: 'Профиль добычи',
      path: '/mining-profile',
    },
  ];

  const [valueTab, setValueTab] = useState<Array<NavItem> | null>([
    {
      title: 'Макромапарметры',
      path: '/',
    },
  ]);
  // перемещение по исптории вперед/назад
  history.listen((location) => {
    const switchTab = [
      tabs.find((element) => {
        return element.path === location.pathname;
      }),
    ];
    setValueTab(switchTab ? (switchTab as NavItem[]) : null);
  });

  return (
    <ChoiceGroup
      size="s"
      view="primary"
      form="default"
      items={tabs}
      value={valueTab}
      getItemKey={(item) => item.title}
      getItemLabel={(item) => item.title}
      onChange={({ value }) => {
        setValueTab(value);
        history.push(value ? value[0].path : '/');
      }}
    />
  );
};
