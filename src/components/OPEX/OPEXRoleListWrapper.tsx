import React from 'react';
import { NavigationList } from '@gpn-prototypes/vega-ui';

import Role from '@/types/role';

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
    {roleList.map((role: Role) => {
      return (
        <NavigationList.Item key={role.name} active={selectedRole.name === role.name}>
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
  </NavigationList>
);
