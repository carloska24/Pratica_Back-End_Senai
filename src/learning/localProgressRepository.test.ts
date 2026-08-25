import { describe, expect, it } from "vitest";

import { asStudentId } from "@/student/ids";
import type { KeyValueStorage } from "@/student/storage";

import {
  asCourseId,
  asModuleId,
  asOperationId,
} from "./ids";
import {
  InvalidLearningSnapshotError,
  LearningStorageError,
  LocalProgressRepository,
  RevisionConflictError,
} from "./localProgressRepository";
import { progressStorageKey } from "./namespace";
import type { LearningScope } from "./contracts";

class MemoryStorage implements KeyValueStorage {
  readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

const scope = (student: string): LearningScope => ({
  studentId: asStudentId(student),
  courseId: asCourseId("javascript-backend"),
  courseVersion: "2026.1",
});

describe("LocalProgressRepository", () => {
  it("cria um novo aluno zerado e posicionado em M01", async () => {
    const progress = new LocalProgressRepository({
      storage: new MemoryStorage(),
      now: () => "2026-08-24T12:00:00.000Z",
    });

    const snapshot = await progress.load(scope("student-a"));

    expect(snapshot).toEqual({
      schemaVersion: 2,
      revision: 0,
      scope: scope("student-a"),
      position: { moduleId: "M01", lessonId: null },
      introductions: {},
      lessons: {},
      challenges: {},
      modules: {},
      attempts: [],
      processedOperations: [],
      createdAt: "2026-08-24T12:00:00.000Z",
      updatedAt: "2026-08-24T12:00:00.000Z",
    });
  });

  it("usa namespace v2 por aluno, curso e versão sem compartilhar progresso", async () => {
    const storage = new MemoryStorage();
    const progress = new LocalProgressRepository({ storage });
    const ana = scope("student-a");
    const bruno = scope("student-b");

    await progress.apply(
      ana,
      {
        type: "START_MODULE_INTRODUCTION",
        moduleId: asModuleId("M01"),
        operationId: asOperationId("operation-1"),
      },
      0,
    );

    expect((await progress.load(ana)).introductions[asModuleId("M01")]).toBe(
      "INTRODUCTION_STARTED",
    );
    expect((await progress.load(bruno)).introductions).toEqual({});
    expect(
      storage.values.has(
        "campus:v2:student:student-a:course:javascript-backend:2026.1:progress",
      ),
    ).toBe(true);
  });

  it("trata a repetição do mesmo operationId como retry idempotente", async () => {
    const progress = new LocalProgressRepository({ storage: new MemoryStorage() });
    const command = {
      type: "START_MODULE_INTRODUCTION" as const,
      moduleId: asModuleId("M01"),
      operationId: asOperationId("operation-1"),
    };

    const first = await progress.apply(scope("student-a"), command, 0);
    const retry = await progress.apply(scope("student-a"), command, 0);

    expect(first.revision).toBe(1);
    expect(retry).toEqual(first);
    expect(retry.processedOperations).toEqual(["operation-1"]);
  });

  it("rejeita comando novo quando expectedRevision está desatualizada", async () => {
    const progress = new LocalProgressRepository({ storage: new MemoryStorage() });
    const studentScope = scope("student-a");
    await progress.apply(
      studentScope,
      {
        type: "START_MODULE_INTRODUCTION",
        moduleId: asModuleId("M01"),
        operationId: asOperationId("operation-1"),
      },
      0,
    );

    await expect(
      progress.apply(
        studentScope,
        {
          type: "COMPLETE_MODULE_INTRODUCTION",
          moduleId: asModuleId("M01"),
          operationId: asOperationId("operation-2"),
        },
        0,
      ),
    ).rejects.toMatchObject({
      expectedRevision: 0,
      actualRevision: 1,
    });
  });

  it("aplica transições acadêmicas como evidências, sem persistir percentual", async () => {
    const progress = new LocalProgressRepository({ storage: new MemoryStorage() });
    const studentScope = scope("student-a");

    const started = await progress.apply(
      studentScope,
      {
        type: "START_MODULE_INTRODUCTION",
        moduleId: asModuleId("M01"),
        operationId: asOperationId("operation-1"),
      },
      0,
    );
    const completed = await progress.apply(
      studentScope,
      {
        type: "COMPLETE_MODULE_INTRODUCTION",
        moduleId: asModuleId("M01"),
        operationId: asOperationId("operation-2"),
      },
      started.revision,
    );

    expect(completed.introductions[asModuleId("M01")]).toBe(
      "INTRODUCTION_COMPLETED",
    );
    expect(completed.modules[asModuleId("M01")]).toBe(
      "INTRODUCTION_COMPLETED",
    );
    expect(completed).not.toHaveProperty("progress");
    expect(completed.revision).toBe(2);
  });

  it("rejeita snapshot inválido ou pertencente a outro escopo", async () => {
    const storage = new MemoryStorage();
    const studentScope = scope("student-a");
    storage.setItem(
      progressStorageKey(studentScope),
      JSON.stringify({ schemaVersion: 2, revision: "invalid" }),
    );

    await expect(
      new LocalProgressRepository({ storage }).load(studentScope),
    ).rejects.toBeInstanceOf(InvalidLearningSnapshotError);
  });

  it("expõe falhas de leitura e escrita do armazenamento", async () => {
    const storage: KeyValueStorage = {
      getItem: () => {
        throw new Error("storage blocked");
      },
      setItem: () => undefined,
      removeItem: () => undefined,
    };

    await expect(
      new LocalProgressRepository({ storage }).load(scope("student-a")),
    ).rejects.toBeInstanceOf(LearningStorageError);
  });
});
