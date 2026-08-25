import { z } from "zod";

import { asStudentId } from "@/student/ids";

import { LEARNING_SCHEMA_VERSION } from "./contracts";
import {
  asAttemptId,
  asChallengeId,
  asCourseId,
  asLessonId,
  asModuleId,
  asOperationId,
} from "./ids";

const isoTimestampSchema = z.string().datetime({ offset: true });
const courseVersionSchema = z.string().min(1).max(64);
const learningStateSchema = z.enum([
  "NOT_STARTED",
  "INTRODUCTION_STARTED",
  "INTRODUCTION_COMPLETED",
  "IN_PROGRESS",
  "PRACTICED",
  "MASTERED",
]);
const activityStateSchema = z.enum(["IN_PROGRESS", "PRACTICED", "MASTERED"]);

export const learningScopeSchema = z
  .object({
    studentId: z.string().transform(asStudentId),
    courseId: z.string().transform(asCourseId),
    courseVersion: courseVersionSchema,
  })
  .strict();

const activityProgressSchema = z
  .object({
    moduleId: z.string().transform(asModuleId),
    state: activityStateSchema,
  })
  .strict();

export const learningSnapshotSchema = z
  .object({
    schemaVersion: z.literal(LEARNING_SCHEMA_VERSION),
    revision: z.number().int().nonnegative(),
    scope: learningScopeSchema,
    position: z
      .object({
        moduleId: z.string().transform(asModuleId),
        lessonId: z.string().transform(asLessonId).nullable(),
      })
      .strict(),
    introductions: z.record(
      z.string().transform(asModuleId),
      z.enum(["INTRODUCTION_STARTED", "INTRODUCTION_COMPLETED"]),
    ),
    lessons: z.record(z.string().transform(asLessonId), activityProgressSchema),
    challenges: z.record(
      z.string().transform(asChallengeId),
      activityProgressSchema,
    ),
    modules: z.record(z.string().transform(asModuleId), learningStateSchema),
    attempts: z.array(
      z
        .object({
          attemptId: z.string().transform(asAttemptId),
          moduleId: z.string().transform(asModuleId),
          activityId: z.string().min(1).max(128),
          outcome: z.enum(["COMPLETED", "NEEDS_REVIEW"]),
          recordedAt: isoTimestampSchema,
        })
        .strict(),
    ),
    processedOperations: z.array(z.string().transform(asOperationId)),
    createdAt: isoTimestampSchema,
    updatedAt: isoTimestampSchema,
  })
  .strict();
