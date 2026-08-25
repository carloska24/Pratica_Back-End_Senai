// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ModuleIntroduction } from "./ModuleIntroduction";

afterEach(cleanup);

describe("Porta do M01", () => {
  it("não pontua uma previsão incorreta e só libera a aula após executar o primeiro programa", () => {
    const onComplete = vi.fn();
    render(<ModuleIntroduction studentName="Ana" onComplete={onComplete} />);

    expect(screen.getByRole("button", { name: /usar meu nome/i })).toBeDisabled();
    fireEvent.click(screen.getByRole("radio", { name: /nada aparecerá/i }));
    fireEvent.click(screen.getByRole("button", { name: /conferir previsão/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/vamos descobrir executando/i);
    expect(screen.getByRole("button", { name: /abrir aula 01/i })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /executar programa/i }));

    expect(screen.getByRole("button", { name: /usar meu nome/i })).toBeEnabled();
    expect(within(screen.getByRole("log", { name: /saída do programa/i })).getByText("Olá, Campus!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /abrir aula 01/i })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: /abrir aula 01/i }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("personaliza a segunda execução sem alterar o restante da experiência", () => {
    render(<ModuleIntroduction studentName="Ana" onComplete={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /executar programa/i }));
    fireEvent.click(screen.getByRole("button", { name: /usar meu nome/i }));
    fireEvent.click(screen.getByRole("button", { name: /executar programa/i }));

    expect(screen.getByText("Olá, Ana!")).toBeInTheDocument();
  });
});
