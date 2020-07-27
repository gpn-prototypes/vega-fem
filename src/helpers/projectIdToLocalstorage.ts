const localStorageKey: string = 'projectId';

export function projectIdFromLocalStorage() {
  let value = localStorage.getItem(localStorageKey) || '';
  if (!value) {
    localStorage.setItem(
      localStorageKey,
      '5f190a1c0bc84947cad9d7f0',
    );
    value = localStorage.getItem(localStorageKey) || '';
  }

  return value;
}
