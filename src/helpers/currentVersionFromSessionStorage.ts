const localStorageKey = 'currentVersion';

export function currentVersionFromSessionStorage() {
  const value = sessionStorage.getItem(localStorageKey) || '';

  return +value;
}
