import type { LearningScope } from "./contracts";

export function progressStorageKey(scope: LearningScope) {
  return `campus:v2:student:${scope.studentId}:course:${scope.courseId}:${scope.courseVersion}:progress`;
}

export function migrationStorageKey(studentId: string, migrationId: string) {
  return `campus:v2:student:${studentId}:migration:${migrationId}`;
}
