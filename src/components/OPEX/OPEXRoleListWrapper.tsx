import {NavigationList} from '@gpn-prototypes/vega-navigation-list';
import React from 'react';

const roleList = [
  {
    name: "Обустройство",
  },
  {
    name: "Экономика",
  }
];

export const OPEXRoleList = (): React.ReactElement => (
  <NavigationList>
    {roleList.map(role =>
      <NavigationList.Item active={true}>
        {(props) => (
          <button
            type="button"
            {...props}
          >
            {role.name}
          </button>
        )}
      </NavigationList.Item>
    )}
  </NavigationList>
);
