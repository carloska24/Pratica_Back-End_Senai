export type CourseId = string & { readonly __brand: "CourseId" };
export type ModuleId = string & { readonly __brand: "ModuleId" };
export type LessonId = string & { readonly __brand: "LessonId" };
export type ChallengeId = string & { readonly __brand: "ChallengeId" };
export type AttemptId = string & { readonly __brand: "AttemptId" };
export type OperationId = string & { readonly __brand: "OperationId" };

const opaqueIdPattern = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const moduleIdPattern = /^M(?:0[1-9]|[1-9][0-9])$/;

function opaque<T extends string>(value: string, name: string): T {
  if (!opaqueIdPattern.test(value)) {
    throw new TypeError(`${name} must be a non-empty opaque identifier.`);
  }
  return value as T;
}

export const asCourseId = (value: string) => opaque<CourseId>(value, "CourseId");
export const asLessonId = (value: string) => opaque<LessonId>(value, "LessonId");
export const asChallengeId = (value: string) =>
  opaque<ChallengeId>(value, "ChallengeId");
export const asAttemptId = (value: string) =>
  opaque<AttemptId>(value, "AttemptId");
export const asOperationId = (value: string) =>
  opaque<OperationId>(value, "OperationId");

export function asModuleId(value: string): ModuleId {
  if (!moduleIdPattern.test(value)) {
    throw new TypeError("ModuleId must use the M01-M99 format.");
  }
  return value as ModuleId;
}
