import Role from '../../../types/role';

export interface OPEXRoleAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

export const OPEX_ROLE_SELECTED = 'OPEX_ROLE_SELECTED';

export const selectOPEXRole = (role: Role): OPEXRoleAction => ({
  type: OPEX_ROLE_SELECTED,
  payload: role,
});
