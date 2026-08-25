import type { StudentId } from "@/student/ids";

import type {
  AttemptId,
  ChallengeId,
  CourseId,
  LessonId,
  ModuleId,
  OperationId,
} from "./ids";

export const LEARNING_SCHEMA_VERSION = 2 as const;

export type LearningState =
  | "NOT_STARTED"
  | "INTRODUCTION_STARTED"
  | "INTRODUCTION_COMPLETED"
  | "IN_PROGRESS"
  | "PRACTICED"
  | "MASTERED";

export interface LearningScope {
  studentId: StudentId;
  courseId: CourseId;
  courseVersion: string;
}

export interface LearningPosition {
  moduleId: ModuleId;
  lessonId: LessonId | null;
}

export interface ActivityProgress {
  moduleId: ModuleId;
  state: Extract<LearningState, "IN_PROGRESS" | "PRACTICED" | "MASTERED">;
}

export interface AttemptSummary {
  attemptId: AttemptId;
  moduleId: ModuleId;
  activityId: string;
  outcome: "COMPLETED" | "NEEDS_REVIEW";
  recordedAt: string;
}

export interface LearningSnapshot {
  schemaVersion: typeof LEARNING_SCHEMA_VERSION;
  revision: number;
  scope: LearningScope;
  position: LearningPosition;
  introductions: Partial<Record<ModuleId, Extract<LearningState, "INTRODUCTION_STARTED" | "INTRODUCTION_COMPLETED">>>;
  lessons: Partial<Record<LessonId, ActivityProgress>>;
  challenges: Partial<Record<ChallengeId, ActivityProgress>>;
  modules: Partial<Record<ModuleId, LearningState>>;
  attempts: AttemptSummary[];
  processedOperations: OperationId[];
  createdAt: string;
  updatedAt: string;
}

interface CommandBase {
  operationId: OperationId;
  moduleId: ModuleId;
}

export type ProgressCommand =
  | (CommandBase & { type: "START_MODULE_INTRODUCTION" })
  | (CommandBase & { type: "COMPLETE_MODULE_INTRODUCTION" })
  | (CommandBase & { type: "START_LESSON"; lessonId: LessonId })
  | (CommandBase & { type: "RECORD_LESSON_PRACTICE"; lessonId: LessonId })
  | (CommandBase & { type: "MASTER_MODULE" })
  | (CommandBase & {
      type: "RECORD_ATTEMPT";
      attemptId: AttemptId;
      activityId: string;
      outcome: AttemptSummary["outcome"];
    })
  | (CommandBase & { type: "RESET_MODULE" });

export interface ProgressRepository {
  load(scope: LearningScope): Promise<LearningSnapshot>;
  apply(
    scope: LearningScope,
    command: ProgressCommand,
    expectedRevision: number,
  ): Promise<LearningSnapshot>;
}
