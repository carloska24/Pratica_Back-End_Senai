import { describe, expect, it } from "vitest";

describe("catálogo do laboratório", () => {
  it("oferece exatamente os módulos M01 a M12", async () => {
    const catalog = await import("./missionCatalog");
    const labModules = (catalog as unknown as { labModules?: Array<{ id: string }> }).labModules;

    expect(labModules?.map(module => module.id)).toEqual([
      "M01", "M02", "M03", "M04", "M05", "M06",
      "M07", "M08", "M09", "M10", "M11", "M12",
    ]);
  });

  it("separa revisões M01–M06 de missões certificadoras M07–M12", async () => {
    const { labModules } = await import("./missionCatalog");
    const modules = labModules as ReadonlyArray<{
      id: string;
      kind?: "review" | "mission";
      title?: string;
      concepts?: readonly string[];
      mission?: { fileName: string; code: string; expectedTests: number };
    }>;

    expect(modules.slice(0, 6).every(module => module.kind === "review")).toBe(true);
    expect(modules.slice(6).every(module => module.kind === "mission")).toBe(true);
    expect(modules.every(module => Boolean(module.title && module.concepts?.length))).toBe(true);
    expect(modules.slice(6).every(module => Boolean(module.mission?.fileName && module.mission.code && module.mission.expectedTests))).toBe(true);
  });

  it("mantém revisões livres e desbloqueia missões em sequência", async () => {
    const catalog = await import("./missionCatalog");
    const isAvailable = (catalog as unknown as {
      isLabModuleAvailable?: (moduleId: string, mastered: readonly string[]) => boolean;
    }).isLabModuleAvailable;

    expect(isAvailable).toBeTypeOf("function");
    if (!isAvailable) return;

    expect(isAvailable("M01", [])).toBe(true);
    expect(isAvailable("M06", [])).toBe(true);
    expect(isAvailable("M07", [])).toBe(true);
    expect(isAvailable("M08", [])).toBe(false);
    expect(isAvailable("M08", ["M07"])).toBe(true);
    expect(isAvailable("M12", ["M07", "M08", "M09", "M10"])).toBe(false);
    expect(isAvailable("M12", ["M07", "M08", "M09", "M10", "M11"])).toBe(true);
  });

  it("resolve a suíte pelo módulo selecionado, nunca pelo nome do arquivo", async () => {
    const catalog = await import("./missionCatalog");
    const resolveExecutionMission = (catalog as unknown as {
      resolveExecutionMission?: (moduleId: string, mastered: readonly string[]) => string | null;
    }).resolveExecutionMission;

    expect(resolveExecutionMission).toBeTypeOf("function");
    if (!resolveExecutionMission) return;

    expect(resolveExecutionMission("M02", [])).toBeNull();
    expect(resolveExecutionMission("M07", [])).toBe("M07");
    expect(resolveExecutionMission("M09", ["M07"])).toBeNull();
    expect(resolveExecutionMission("M09", ["M07", "M08"])).toBe("M09");
  });

  it("só libera a validação depois que a missão selecionada foi carregada", async () => {
    const catalog = await import("./missionCatalog");
    const resolveMissionValidation = (catalog as unknown as {
      resolveMissionValidation?: (moduleId: string, loadedMissionId: string | null) => string | null;
    }).resolveMissionValidation;

    expect(resolveMissionValidation).toBeTypeOf("function");
    if (!resolveMissionValidation) return;

    expect(resolveMissionValidation("M07", null)).toBeNull();
    expect(resolveMissionValidation("M07", "M07")).toBe("M07");
    expect(resolveMissionValidation("M08", "M07")).toBeNull();
    expect(resolveMissionValidation("M03", "M07")).toBeNull();
  });
});
