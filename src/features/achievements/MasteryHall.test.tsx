// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";

import type { AchievementProjection } from "@/achievements/achievementCatalog";

import { MasteryHall } from "./MasteryHall";

afterEach(cleanup);

const achievements: AchievementProjection[] = [
  {
    id: "first-signal",
    name: "Primeiro Sinal",
    description: "Seu primeiro programa respondeu.",
    evidenceLabel: "Introdução do M01 concluída",
    category: "milestone",
    tier: "bronze",
    symbol: "signal",
    status: "earned",
    progress: { current: 1, target: 1 },
  },
  {
    id: "foundation-built",
    name: "Fundação Erguida",
    description: "Você dominou os fundamentos.",
    evidenceLabel: "Domine o M01",
    category: "mastery",
    tier: "silver",
    symbol: "shield",
    status: "locked",
    progress: { current: 0, target: 1 },
  },
];

describe("MasteryHall", () => {
  it("apresenta coleção, contagem e evidência da conquista em destaque", () => {
    render(<MasteryHall studentName="Ana Silva" achievements={achievements} />);

    expect(screen.getByRole("heading", { name: /salão de maestria/i })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: /1 de 2 conquistadas/i })).toBeInTheDocument();
    expect(screen.getByText("Introdução do M01 concluída")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fundação erguida/i })).toHaveAccessibleName(/bloqueada/i);
  });

  it("permite inspecionar uma conquista bloqueada e mostra seu progresso", () => {
    render(<MasteryHall studentName="Ana Silva" achievements={achievements} />);

    fireEvent.click(screen.getByRole("button", { name: /fundação erguida/i }));

    expect(screen.getByRole("heading", { name: "Fundação Erguida" })).toBeInTheDocument();
    expect(screen.getByText("Domine o M01")).toBeInTheDocument();
    expect(screen.getByText(/0 de 1 etapas/i)).toBeInTheDocument();
  });
});
