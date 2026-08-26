import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

describe("seletor de módulo do laboratório", () => {
  it("permite revisões e bloqueia missões sem pré-requisito", async () => {
    const modulePath = "./LabModulePicker";
    const module = await import(/* @vite-ignore */ modulePath).catch(() => ({}));
    const LabModulePicker = (module as { LabModulePicker?: React.ComponentType<{
      selectedModuleId: "M01";
      mastered: readonly never[];
      onSelect: (moduleId: string) => void;
    }> }).LabModulePicker;
    const onSelect = vi.fn();

    expect(LabModulePicker).toBeTypeOf("function");
    if (!LabModulePicker) return;

    const html = renderToStaticMarkup(createElement(LabModulePicker, { selectedModuleId: "M01", mastered: [], onSelect }));

    expect(html).toContain("M01");
    expect(html).toContain("Fundamentos JavaScript");
    expect(html).toContain("M07");
    expect(html).toContain("Funções");
    expect(html).toMatch(/disabled=""[^>]*>[^<]*(?:<[^>]+>)*[^<]*M08|M08[\s\S]*disabled=""/);
  });
});
