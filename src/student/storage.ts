export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const activeStudentStorageKey = "campus:v2:active-student";
export const studentIndexStorageKey = "campus:v2:students";

export function studentProfileStorageKey(studentId: string) {
  return `campus:v2:student:${studentId}:profile`;
}

export function browserStorage(): KeyValueStorage {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("Local storage is unavailable in this environment.");
  }

  return window.localStorage;
}
