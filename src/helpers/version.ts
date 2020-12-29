const sessionStorageKey = 'currentVersion';

export function getCurrentVersion(): number {
  const value = sessionStorage.getItem(sessionStorageKey) || '';
  return +value;
}

export function incrementVersion(): void {
  sessionStorage.setItem(sessionStorageKey, `${getCurrentVersion() + 1}`);
}
export function setCurrentVersion(version: number): void {
  sessionStorage.setItem(sessionStorageKey, `${version}`);
}
