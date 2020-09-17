const localStorageKey = 'projectId';

export function projectIdFromLocalStorage() {
  let value = localStorage.getItem(localStorageKey) || '';
  if (!value) {
    localStorage.setItem(localStorageKey, 'a3333333-b111-c111-d111-e00000000000');
    value = localStorage.getItem(localStorageKey) || '';
  }

  return value;
}
