import React from 'react';
import { NavigationList } from '@gpn-prototypes/vega-navigation-list';

import Role from '../../../types/role';
import keyGen from '../../helpers/keyGenerator';

export interface OPEXRoleListWrapperProps {
  roleList: any[];
  selectedRole: Role;
  selectRole: (role: Role) => void;
}

export const OPEXRoleListWrapper = ({
  roleList,
  selectedRole,
  selectRole,
}: OPEXRoleListWrapperProps): React.ReactElement => (
  <NavigationList>
    {roleList.map((role: Role, index: number) => {
      return (
        <NavigationList.Item key={keyGen(index)} active={selectedRole.name === role.name}>
          {(props) => (
            <button
              type="button"
              onClick={() => {
                selectRole(role);
              }}
              {...props}
            >
              {role.name}
            </button>
          )}
        </NavigationList.Item>
      );
    })}
    )
  </NavigationList>
);
