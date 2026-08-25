// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FunctionFlow from "./FunctionFlow";

describe("simulação guiada de funções", () => {
  it("se distingue da Bancada e comunica seleção e passo atual", () => {
    render(<FunctionFlow />);

    expect(screen.getByText("SIMULAÇÃO GUIADA")).toBeTruthy();
    const trueButton = screen.getByRole("button", { name: "true" });
    fireEvent.click(trueButton);
    expect(trueButton.getAttribute("aria-pressed")).toBe("true");

    const firstStep = screen.getByRole("button", { name: /01 · Chamada/ });
    expect(firstStep.getAttribute("aria-current")).toBe("step");
  });
});
