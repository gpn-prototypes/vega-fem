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
      title: 'Макропараметры',
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
  const currentTab = tabs.find((element) => {
    return element.path === history.location.pathname;
  }) as NavItem;
  const [valueTab, setValueTab] = useState<NavItem | null>(currentTab);
  // перемещение по исптории вперед/назад
  history.listen((location) => {
    const switchTab = tabs.find((element) => {
      return element.path === location.pathname;
    });
    setValueTab(switchTab ? (switchTab as NavItem) : null);
  });

  return (
    <ChoiceGroup
      size="s"
      view="primary"
      form="default"
      name=""
      multiple={false}
      items={tabs}
      value={valueTab}
      getLabel={(item): string => item.title}
      onChange={({ value }): void => {
        setValueTab(value);
        history.push(value ? value.path : '/');
      }}
    />
  );
};
