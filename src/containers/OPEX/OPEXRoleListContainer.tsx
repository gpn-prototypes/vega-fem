import React, {useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Role from '../../../types/role';
import {selectOPEXRole} from '../../actions/OPEX/selectOPEXRole';
import {OPEXRoleListWrapper} from '../../components/OPEX/OPEXRoleListWrapper';

const roleList: Role[] = [
  {
    name: "Обустройство",
  },
  {
    name: "Экономика",
  }
];

export const OPEXRoleListContainer = () => {
  const dispatch = useDispatch();

  const selectorRole = (state: any) => state.OPEXReducer.selectedRole;
  const selectedRole = useSelector(selectorRole);

  const OPEXSelectRole = useCallback(
    (role: Role) => {
      dispatch(selectOPEXRole(role));
    },
    [dispatch],
  );

  return <div>
    <OPEXRoleListWrapper
      roleList={roleList}
      selectedRole={selectedRole}
      selectRole={OPEXSelectRole}
    />
  </div>;
};
