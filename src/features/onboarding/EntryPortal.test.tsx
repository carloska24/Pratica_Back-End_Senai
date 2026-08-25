// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EntryPortal } from "./EntryPortal";

afterEach(cleanup);

describe("Portal de Entrada", () => {
  it("explica o limite do perfil local e cria um perfil com nome válido", () => {
    const onCreateProfile = vi.fn();
    render(<EntryPortal profiles={[]} onCreateProfile={onCreateProfile} onActivateProfile={vi.fn()} />);

    expect(screen.getByText(/salvo somente neste navegador/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /criar meu perfil local/i })).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/como devemos chamar você/i), { target: { value: "  Ana Silva  " } });
    fireEvent.click(screen.getByRole("button", { name: /criar meu perfil local/i }));

    expect(onCreateProfile).toHaveBeenCalledWith("Ana Silva");
  });

  it("permite retomar um perfil existente sem exibir a identidade de Carlos", () => {
    const onActivateProfile = vi.fn();
    render(
      <EntryPortal
        profiles={[{ id: "student-ana", displayName: "Ana Silva", initials: "AS" }]}
        onCreateProfile={vi.fn()}
        onActivateProfile={onActivateProfile}
      />,
    );

    expect(screen.queryByText(/Carlos Pereira/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /continuar como Ana Silva/i }));
    expect(onActivateProfile).toHaveBeenCalledWith("student-ana");
  });
});
