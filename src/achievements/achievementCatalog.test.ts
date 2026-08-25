import { describe, expect, it } from "vitest";

import { asAttemptId, asChallengeId, asCourseId, asLessonId, asModuleId } from "@/learning/ids";
import type { LearningSnapshot } from "@/learning/contracts";
import { asStudentId } from "@/student/ids";

import { evaluateAchievements } from "./achievementCatalog";

function snapshot(overrides: Partial<LearningSnapshot> = {}): LearningSnapshot {
  return {
    schemaVersion: 2,
    revision: 0,
    scope: {
      studentId: asStudentId("student-a"),
      courseId: asCourseId("javascript-backend"),
      courseVersion: "2026.1",
    },
    position: { moduleId: asModuleId("M01"), lessonId: null },
    introductions: {},
    lessons: {},
    challenges: {},
    modules: {},
    attempts: [],
    processedOperations: [],
    createdAt: "2026-08-24T12:00:00.000Z",
    updatedAt: "2026-08-24T12:00:00.000Z",
    ...overrides,
  };
}

describe("evaluateAchievements", () => {
  it("não entrega conquistas automaticamente a um aluno novo", () => {
    const achievements = evaluateAchievements(snapshot());

    expect(achievements).toHaveLength(11);
    expect(achievements.every(item => item.status !== "earned")).toBe(true);
    expect(achievements.find(item => item.id === "first-signal")).toMatchObject({
      status: "locked",
      progress: { current: 0, target: 1 },
    });
  });

  it("conquista marcos a partir de introdução, prática e domínio comprovados", () => {
    const m01 = asModuleId("M01");
    const lessonId = asLessonId("M01-A01");
    const achievements = evaluateAchievements(snapshot({
      introductions: { [m01]: "INTRODUCTION_COMPLETED" },
      lessons: { [lessonId]: { moduleId: m01, state: "PRACTICED" } },
      modules: { [m01]: "MASTERED" },
    }));

    expect(achievements.filter(item => item.status === "earned").map(item => item.id)).toEqual(
      expect.arrayContaining(["first-signal", "first-build", "foundation-built", "full-cycle"]),
    );
  });

  it("reconhece recuperação somente na mesma atividade e na ordem correta", () => {
    const m01 = asModuleId("M01");
    const achievements = evaluateAchievements(snapshot({
      attempts: [
        { attemptId: asAttemptId("attempt-1"), moduleId: m01, activityId: "M01-A01", outcome: "NEEDS_REVIEW", recordedAt: "2026-08-24T10:00:00.000Z" },
        { attemptId: asAttemptId("attempt-2"), moduleId: m01, activityId: "M01-A01", outcome: "COMPLETED", recordedAt: "2026-08-24T11:00:00.000Z" },
      ],
    }));

    expect(achievements.find(item => item.id === "learned-from-error")?.status).toBe("earned");
  });

  it("projeta progresso parcial sem confundir desafio concluído com módulo dominado", () => {
    const m01 = asModuleId("M01");
    const achievements = evaluateAchievements(snapshot({
      challenges: {
        [asChallengeId("challenge-1")]: { moduleId: m01, state: "MASTERED" },
        [asChallengeId("challenge-2")]: { moduleId: m01, state: "MASTERED" },
      },
    }));

    expect(achievements.find(item => item.id === "arena-explorer")).toMatchObject({
      status: "in-progress",
      progress: { current: 2, target: 3 },
    });
    expect(achievements.find(item => item.id === "foundation-built")?.status).toBe("locked");
  });
});
