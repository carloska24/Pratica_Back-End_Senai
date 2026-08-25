// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { StudentExperience } from "./StudentExperience";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("jornada do novo aluno", () => {
  it("cria um perfil zerado, conclui a Porta do M01 e abre a Aula 01", async () => {
    render(<StudentExperience />);

    expect(await screen.findByRole("heading", { name: /sua trilha começa aqui/i })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/como devemos chamar você/i), { target: { value: "Ana Silva" } });
    fireEvent.click(screen.getByRole("button", { name: /criar meu perfil local/i }));

    expect(await screen.findByRole("heading", { name: /como fazemos o computador/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /executar programa/i }));
    fireEvent.click(screen.getByRole("button", { name: /abrir aula 01/i }));

    expect(await screen.findByRole("heading", { name: /Aula 01 · Variáveis, let, const e tipos/i }, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /começar pela explicação/i })).toBeInTheDocument();
    expect(screen.queryByText(/Carlos Pereira/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /visão geral/i }));
    expect(screen.getByText(/0% concluído/i)).toBeInTheDocument();

    await waitFor(() => expect(localStorage.getItem("campus:v2:active-student")).toBeTruthy());
  });
});
