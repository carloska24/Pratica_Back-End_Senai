import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StudentExperience } from "./StudentExperience";

describe("StudentExperience no servidor", () => {
  it("pré-renderiza o estado de preparação sem acessar localStorage", () => {
    expect(() => renderToStaticMarkup(<StudentExperience />)).not.toThrow();
    expect(renderToStaticMarkup(<StudentExperience />)).toContain("Preparando o Campus");
  });
});
