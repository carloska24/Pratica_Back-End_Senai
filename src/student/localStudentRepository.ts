import type {
  CreateStudentProfileInput,
  StudentProfile,
  StudentRepository,
  UpdateStudentProfileInput,
} from "./contracts";
import { asStudentId, createStudentId, type StudentId } from "./ids";
import {
  displayNameSchema,
  studentIndexSchema,
  studentProfileSchema,
} from "./schemas";
import {
  activeStudentStorageKey,
  browserStorage,
  type KeyValueStorage,
  studentIndexStorageKey,
  studentProfileStorageKey,
} from "./storage";

export class StudentNotFoundError extends Error {
  constructor(readonly studentId: StudentId) {
    super(`Student profile not found: ${studentId}`);
    this.name = "StudentNotFoundError";
  }
}

export class InvalidStudentProfileError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "InvalidStudentProfileError";
  }
}

export class StudentStorageError extends Error {
  constructor(readonly operation: "read" | "write", options?: ErrorOptions) {
    super(`Unable to ${operation} student data.`, options);
    this.name = "StudentStorageError";
  }
}

interface LocalStudentRepositoryDependencies {
  storage?: KeyValueStorage;
  createId?: () => StudentId;
  now?: () => string;
}

function initialsFor(displayName: string) {
  const words = displayName.split(" ").filter(Boolean);
  const selected = words.length === 1 ? words : [words[0], words.at(-1)!];
  return selected
    .map((word) => Array.from(word)[0])
    .join("")
    .toLocaleUpperCase("pt-BR");
}

export class LocalStudentRepository implements StudentRepository {
  private readonly storage: KeyValueStorage;
  private readonly createId: () => StudentId;
  private readonly now: () => string;

  constructor(dependencies: LocalStudentRepositoryDependencies = {}) {
    this.storage = dependencies.storage ?? browserStorage();
    this.createId = dependencies.createId ?? createStudentId;
    this.now = dependencies.now ?? (() => new Date().toISOString());
  }

  async getActiveProfile(): Promise<StudentProfile | null> {
    const value = this.read(activeStudentStorageKey);
    if (value === null) return null;

    let studentId: StudentId;
    try {
      studentId = asStudentId(value);
    } catch (error) {
      throw new InvalidStudentProfileError("Active student id is invalid.", {
        cause: error,
      });
    }

    return this.requireProfile(studentId);
  }

  async listProfiles(): Promise<StudentProfile[]> {
    return this.readIndex().map((studentId) => this.requireProfile(studentId));
  }

  async createProfile(
    input: CreateStudentProfileInput,
  ): Promise<StudentProfile> {
    const displayName = displayNameSchema.parse(input.displayName);
    const id = this.createId();
    const timestamp = this.now();
    const profile = studentProfileSchema.parse({
      id,
      displayName,
      initials: initialsFor(displayName),
      mode: "LOCAL",
      onboardingStatus: "NOT_STARTED",
      createdAt: timestamp,
      updatedAt: timestamp,
    }) as StudentProfile;

    if (this.read(studentProfileStorageKey(id)) !== null) {
      throw new InvalidStudentProfileError(`Student id already exists: ${id}`);
    }

    this.write(studentProfileStorageKey(id), JSON.stringify(profile));
    const index = this.readIndex();
    this.write(studentIndexStorageKey, JSON.stringify([...index, id]));
    this.write(activeStudentStorageKey, id);
    return profile;
  }

  async activateProfile(studentId: StudentId): Promise<void> {
    this.requireProfile(studentId);
    this.write(activeStudentStorageKey, studentId);
  }

  async updateProfile(
    studentId: StudentId,
    input: UpdateStudentProfileInput,
  ): Promise<StudentProfile> {
    const current = this.requireProfile(studentId);
    const displayName =
      input.displayName === undefined
        ? current.displayName
        : displayNameSchema.parse(input.displayName);
    const updated = studentProfileSchema.parse({
      ...current,
      displayName,
      initials: initialsFor(displayName),
      onboardingStatus: input.onboardingStatus ?? current.onboardingStatus,
      updatedAt: this.now(),
    }) as StudentProfile;

    this.write(studentProfileStorageKey(studentId), JSON.stringify(updated));
    return updated;
  }

  private requireProfile(studentId: StudentId): StudentProfile {
    const serialized = this.read(studentProfileStorageKey(studentId));
    if (serialized === null) throw new StudentNotFoundError(studentId);

    try {
      return studentProfileSchema.parse(JSON.parse(serialized)) as StudentProfile;
    } catch (error) {
      throw new InvalidStudentProfileError(
        `Stored student profile is invalid: ${studentId}`,
        { cause: error },
      );
    }
  }

  private readIndex(): StudentId[] {
    const serialized = this.read(studentIndexStorageKey);
    if (serialized === null) return [];

    try {
      return studentIndexSchema.parse(JSON.parse(serialized));
    } catch (error) {
      throw new InvalidStudentProfileError("Stored student index is invalid.", {
        cause: error,
      });
    }
  }

  private read(key: string) {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      throw new StudentStorageError("read", { cause: error });
    }
  }

  private write(key: string, value: string) {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      throw new StudentStorageError("write", { cause: error });
    }
  }
}
