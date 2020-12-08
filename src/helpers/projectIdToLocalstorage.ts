const localStorageKey = 'projectId';

export function projectIdFromLocalStorage() {
  return sessionStorage.getItem(localStorageKey) || '';
}

export function setProjectId(id: string) {
  sessionStorage.setItem(localStorageKey, id);
}
