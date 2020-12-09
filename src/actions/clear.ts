import { Action } from 'redux';

export const FEM_CLEAR_STORES = 'FEM_CLEAR_STORES';

export const clearStores = (): Action => ({
  type: FEM_CLEAR_STORES,
});
