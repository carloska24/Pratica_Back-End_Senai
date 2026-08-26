const ACTIVE_STUDENT_KEY = "campus-active-student";
const PROGRESS_KEYS = [
  "campus-course-library",
  "campus-function-examples",
  "campus-practice-challenges",
  "campus-lab-attempts",
  "campus-module-mastery",
  "campus-last-lesson",
] as const;

type WorkspaceSnapshot = Partial<Record<(typeof PROGRESS_KEYS)[number], string>>;

function workspaceKey(userId: string) {
  return `campus-student-workspace:${userId}`;
}

function readSnapshot(): WorkspaceSnapshot {
  return PROGRESS_KEYS.reduce<WorkspaceSnapshot>((snapshot, key) => {
    const value = localStorage.getItem(key);
    if (value !== null) snapshot[key] = value;
    return snapshot;
  }, {});
}

function clearProgress() {
  PROGRESS_KEYS.forEach(key => localStorage.removeItem(key));
}

export function switchStudentWorkspace(userId: string) {
  const activeStudent = localStorage.getItem(ACTIVE_STUDENT_KEY);
  if (activeStudent === userId) return;

  if (activeStudent) {
    localStorage.setItem(workspaceKey(activeStudent), JSON.stringify(readSnapshot()));
  }

  clearProgress();

  try {
    const saved = JSON.parse(localStorage.getItem(workspaceKey(userId)) ?? "null") as WorkspaceSnapshot | null;
    if (saved && typeof saved === "object") {
      PROGRESS_KEYS.forEach(key => {
        if (typeof saved[key] === "string") localStorage.setItem(key, saved[key]!);
      });
    }
  } catch {
    // Um snapshot corrompido não deve impedir uma nova jornada.
  }

  localStorage.setItem(ACTIVE_STUDENT_KEY, userId);
  window.dispatchEvent(new Event("campus-progress-changed"));
}
