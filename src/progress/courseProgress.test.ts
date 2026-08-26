import { describe, expect, it } from "vitest";

import { plannedModules } from "@/course/course";
import { getCourseModuleView } from "./courseProgress";

describe("progresso curricular", () => {
  it("libera o próximo módulo em zero sem inventar estudo já realizado", () => {
    const module = plannedModules.find(item => item.id === "M08");
    expect(module).toBeTruthy();
    if (!module) return;

    const view = getCourseModuleView(module, {
      reviews: 0,
      examples: 0,
      challenges: 0,
      attempts: 1,
      m07Mastered: true,
      m08Mastered: false,
      m09Mastered: false,
      m10Mastered: false,
      m11Mastered: false,
      m12Mastered: false,
    });

    expect(view.status).toBe("andamento");
    expect(view.progress).toBe(0);
  });
});
