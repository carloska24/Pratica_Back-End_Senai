import { isValidElement, type ReactElement } from "react";
import { describe, expect, it } from "vitest";
import Home from "./page";
import { StudentExperience } from "@/features/onboarding/StudentExperience";

describe("página inicial", () => {
  it("entra pela jornada de perfis de aluno", () => {
    const page = Home();
    expect(isValidElement(page)).toBe(true);
    expect((page as ReactElement).type).toBe(StudentExperience);
  });
});
