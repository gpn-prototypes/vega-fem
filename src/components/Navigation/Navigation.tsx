import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge, Text } from '@gpn-prototypes/vega-ui';
import bemCn from 'bem-cn';

import './Navigation.css';

import { ProjectContext } from '@/providers';

export const cnNavigation = bemCn('Navigation');

export interface NavItem {
  title: string;
  path: string;
  disabled?: boolean;
}

export const Navigation: React.FC = () => {
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
      disabled: true,
    },
    {
      title: 'Цены',
      path: `${prefix}/prices`,
      disabled: true,
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
      disabled: true,
    },
  ];

  return (
    <div
      className={cnNavigation({ size: 's', form: 'default', view: 'primary', width: 'default' })}
    >
      {tabs.map(({ title, path, disabled }) => {
        if (disabled) {
          return (
            <div className={cnNavigation('Label', { disabled: true })}>
              <Text view="ghost">{title}</Text>
              <Badge
                className={cnNavigation('Badge').toString()}
                label="Скоро"
                view="filled"
                status="system"
                size="s"
                form="round"
              />
            </div>
          );
        }

        return (
          <NavLink
            exact
            activeClassName={cnNavigation('Label', { checked: true })}
            to={path}
            className={cnNavigation('Label')}
          >
            {title}
          </NavLink>
        );
      })}
    </div>
  );
};
