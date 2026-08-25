export type StudentId = string & { readonly __brand: "StudentId" };

const opaqueIdPattern = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export function asStudentId(value: string): StudentId {
  if (!opaqueIdPattern.test(value)) {
    throw new TypeError("StudentId must be a non-empty opaque identifier.");
  }

  return value as StudentId;
}

export function createStudentId(): StudentId {
  return asStudentId(globalThis.crypto.randomUUID());
}
