import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ChoiceGroup } from '@gpn-prototypes/vega-ui';

import { ProjectContext } from '@/providers';

export interface NavItem {
  title: string;
  path: string;
}

export const Navigation: React.FC = () => {
  const history = useHistory();
  const { projectId } = useContext(ProjectContext);

  const prefix = `/projects/show/${projectId}/fem`;

  const tabs: Array<NavItem> = [
    {
      title: 'Макропараметры',
      path: `${prefix}`,
    },
    {
      title: 'Налоговое окружение',
      path: `${prefix}/tax-environment`,
    },
    {
      title: 'Цены',
      path: `${prefix}/prices`,
    },
    {
      title: 'OPEX',
      path: `${prefix}/OPEX`,
    },
    {
      title: 'CAPEX',
      path: `${prefix}/CAPEX`,
    },
    {
      title: 'Профиль добычи',
      path: `${prefix}/mining-profile`,
    },
  ];
  const currentTab = tabs.find((element) => {
    return element.path === history.location.pathname;
  }) as NavItem;
  const [valueTab, setValueTab] = useState<NavItem | null>(currentTab);

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
