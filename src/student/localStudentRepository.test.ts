import { describe, expect, it } from "vitest";

import { asStudentId } from "./ids";
import {
  LocalStudentRepository,
  StudentNotFoundError,
  StudentStorageError,
} from "./localStudentRepository";
import type { KeyValueStorage } from "./storage";

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

function repository(storage: KeyValueStorage = new MemoryStorage()) {
  let sequence = 0;
  return new LocalStudentRepository({
    storage,
    createId: () => asStudentId(`student-${++sequence}`),
    now: () => "2026-08-24T12:00:00.000Z",
  });
}

describe("LocalStudentRepository", () => {
  it("cria um perfil local normalizado, com iniciais, e o ativa", async () => {
    const storage = new MemoryStorage();
    const students = repository(storage);

    const profile = await students.createProfile({
      displayName: "  Ana   Maria  Souza ",
    });

    expect(profile).toEqual({
      id: "student-1",
      displayName: "Ana Maria Souza",
      initials: "AS",
      mode: "LOCAL",
      onboardingStatus: "NOT_STARTED",
      createdAt: "2026-08-24T12:00:00.000Z",
      updatedAt: "2026-08-24T12:00:00.000Z",
    });
    await expect(students.getActiveProfile()).resolves.toEqual(profile);
    expect(storage.values.has("campus:v2:active-student")).toBe(true);
    expect(
      storage.values.has("campus:v2:student:student-1:profile"),
    ).toBe(true);
  });

  it("mantém perfis separados e permite trocar o perfil ativo", async () => {
    const students = repository();
    const ana = await students.createProfile({ displayName: "Ana Souza" });
    const bruno = await students.createProfile({ displayName: "Bruno Lima" });

    expect((await students.listProfiles()).map((profile) => profile.id)).toEqual([
      ana.id,
      bruno.id,
    ]);
    await expect(students.getActiveProfile()).resolves.toEqual(bruno);

    await students.activateProfile(ana.id);

    await expect(students.getActiveProfile()).resolves.toEqual(ana);
  });

  it("atualiza o nome sem alterar identidade nem data de criação", async () => {
    const students = repository();
    const profile = await students.createProfile({ displayName: "Ana Souza" });

    const updated = await students.updateProfile(profile.id, {
      displayName: "Ana Beatriz",
      onboardingStatus: "IN_PROGRESS",
    });

    expect(updated).toMatchObject({
      id: profile.id,
      displayName: "Ana Beatriz",
      initials: "AB",
      onboardingStatus: "IN_PROGRESS",
      createdAt: profile.createdAt,
    });
  });

  it("rejeita nomes vazios ou excessivamente longos", async () => {
    const students = repository();

    await expect(students.createProfile({ displayName: "   " })).rejects.toThrow();
    await expect(
      students.createProfile({ displayName: "a".repeat(81) }),
    ).rejects.toThrow();
  });

  it("não ativa um estudante inexistente", async () => {
    const students = repository();

    await expect(
      students.activateProfile(asStudentId("student-missing")),
    ).rejects.toBeInstanceOf(StudentNotFoundError);
  });

  it("rejeita documentos persistidos inválidos", async () => {
    const storage = new MemoryStorage();
    storage.setItem("campus:v2:active-student", "student-1");
    storage.setItem(
      "campus:v2:student:student-1:profile",
      JSON.stringify({ id: "student-1", displayName: 42 }),
    );

    await expect(repository(storage).getActiveProfile()).rejects.toThrow();
  });

  it("expõe falhas do mecanismo de armazenamento", async () => {
    const storage: KeyValueStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota exceeded");
      },
      removeItem: () => undefined,
    };

    await expect(
      repository(storage).createProfile({ displayName: "Ana" }),
    ).rejects.toBeInstanceOf(StudentStorageError);
  });
});
