const localStorageKey = 'projectId';

export function projectIdFromLocalStorage() {
  let value = sessionStorage.getItem(localStorageKey) || '';
  if (!value) {
    sessionStorage.setItem(localStorageKey, 'a3333333-b111-c111-d111-e00000000000');
    value = sessionStorage.getItem(localStorageKey) || '';
  }

  return value;
}
