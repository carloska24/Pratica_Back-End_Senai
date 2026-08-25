import { asModuleId } from "./ids";
import type {
  LearningScope,
  LearningSnapshot,
  ProgressCommand,
  ProgressRepository,
} from "./contracts";
import { LEARNING_SCHEMA_VERSION } from "./contracts";
import { progressStorageKey } from "./namespace";
import { learningSnapshotSchema } from "./schemas";
import {
  browserStorage,
  type KeyValueStorage,
} from "@/student/storage";

export class RevisionConflictError extends Error {
  constructor(
    readonly expectedRevision: number,
    readonly actualRevision: number,
  ) {
    super(
      `Progress revision conflict: expected ${expectedRevision}, actual ${actualRevision}.`,
    );
    this.name = "RevisionConflictError";
  }
}

export class InvalidLearningSnapshotError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "InvalidLearningSnapshotError";
  }
}

export class LearningStorageError extends Error {
  constructor(readonly operation: "read" | "write", options?: ErrorOptions) {
    super(`Unable to ${operation} learning progress.`, options);
    this.name = "LearningStorageError";
  }
}

interface LocalProgressRepositoryDependencies {
  storage?: KeyValueStorage;
  now?: () => string;
}

function sameScope(left: LearningScope, right: LearningScope) {
  return (
    left.studentId === right.studentId &&
    left.courseId === right.courseId &&
    left.courseVersion === right.courseVersion
  );
}

function initialSnapshot(scope: LearningScope, timestamp: string): LearningSnapshot {
  return {
    schemaVersion: LEARNING_SCHEMA_VERSION,
    revision: 0,
    scope,
    position: { moduleId: asModuleId("M01"), lessonId: null },
    introductions: {},
    lessons: {},
    challenges: {},
    modules: {},
    attempts: [],
    processedOperations: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function applyCommand(
  current: LearningSnapshot,
  command: ProgressCommand,
  timestamp: string,
): LearningSnapshot {
  const next: LearningSnapshot = structuredClone(current);
  next.position.moduleId = command.moduleId;

  switch (command.type) {
    case "START_MODULE_INTRODUCTION":
      next.position.lessonId = null;
      next.introductions[command.moduleId] = "INTRODUCTION_STARTED";
      next.modules[command.moduleId] = "INTRODUCTION_STARTED";
      break;
    case "COMPLETE_MODULE_INTRODUCTION":
      next.position.lessonId = null;
      next.introductions[command.moduleId] = "INTRODUCTION_COMPLETED";
      next.modules[command.moduleId] = "INTRODUCTION_COMPLETED";
      break;
    case "START_LESSON":
      next.position.lessonId = command.lessonId;
      next.lessons[command.lessonId] = {
        moduleId: command.moduleId,
        state: "IN_PROGRESS",
      };
      next.modules[command.moduleId] = "IN_PROGRESS";
      break;
    case "RECORD_LESSON_PRACTICE":
      next.position.lessonId = command.lessonId;
      next.lessons[command.lessonId] = {
        moduleId: command.moduleId,
        state: "PRACTICED",
      };
      next.modules[command.moduleId] = "PRACTICED";
      break;
    case "MASTER_MODULE":
      next.position.lessonId = null;
      next.modules[command.moduleId] = "MASTERED";
      break;
    case "RECORD_ATTEMPT":
      next.attempts.push({
        attemptId: command.attemptId,
        moduleId: command.moduleId,
        activityId: command.activityId,
        outcome: command.outcome,
        recordedAt: timestamp,
      });
      break;
    case "RESET_MODULE": {
      next.position.lessonId = null;
      delete next.introductions[command.moduleId];
      delete next.modules[command.moduleId];
      next.lessons = Object.fromEntries(
        Object.entries(next.lessons).filter(
          ([, progress]) => progress?.moduleId !== command.moduleId,
        ),
      );
      next.challenges = Object.fromEntries(
        Object.entries(next.challenges).filter(
          ([, progress]) => progress?.moduleId !== command.moduleId,
        ),
      );
      next.attempts = next.attempts.filter(
        (attempt) => attempt.moduleId !== command.moduleId,
      );
      break;
    }
  }

  next.revision += 1;
  next.processedOperations.push(command.operationId);
  next.updatedAt = timestamp;
  return next;
}

export class LocalProgressRepository implements ProgressRepository {
  private readonly storage: KeyValueStorage;
  private readonly now: () => string;

  constructor(dependencies: LocalProgressRepositoryDependencies = {}) {
    this.storage = dependencies.storage ?? browserStorage();
    this.now = dependencies.now ?? (() => new Date().toISOString());
  }

  async load(scope: LearningScope): Promise<LearningSnapshot> {
    const serialized = this.read(progressStorageKey(scope));
    if (serialized === null) return initialSnapshot(scope, this.now());

    try {
      const snapshot = learningSnapshotSchema.parse(
        JSON.parse(serialized),
      ) as LearningSnapshot;
      if (!sameScope(snapshot.scope, scope)) {
        throw new Error("Stored snapshot belongs to a different learning scope.");
      }
      return snapshot;
    } catch (error) {
      throw new InvalidLearningSnapshotError(
        "Stored learning snapshot is invalid.",
        { cause: error },
      );
    }
  }

  async apply(
    scope: LearningScope,
    command: ProgressCommand,
    expectedRevision: number,
  ): Promise<LearningSnapshot> {
    const current = await this.load(scope);

    if (current.processedOperations.includes(command.operationId)) return current;
    if (current.revision !== expectedRevision) {
      throw new RevisionConflictError(expectedRevision, current.revision);
    }

    const next = applyCommand(current, command, this.now());
    const validated = learningSnapshotSchema.parse(next) as LearningSnapshot;
    this.write(progressStorageKey(scope), JSON.stringify(validated));
    return validated;
  }

  private read(key: string) {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      throw new LearningStorageError("read", { cause: error });
    }
  }

  private write(key: string, value: string) {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      throw new LearningStorageError("write", { cause: error });
    }
  }
}
