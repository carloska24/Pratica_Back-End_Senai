import type { LearningSnapshot } from "@/learning/contracts";
import { asModuleId } from "@/learning/ids";

export type AchievementCategory = "milestone" | "mastery" | "growth" | "challenge";
export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";
export type AchievementSymbol = "signal" | "tools" | "shield" | "cycle" | "spark" | "compass" | "cup" | "function" | "foundation" | "rocket" | "crown";
export type AchievementStatus = "locked" | "in-progress" | "earned";

export interface AchievementProjection {
  id: string;
  name: string;
  description: string;
  evidenceLabel: string;
  category: AchievementCategory;
  tier: AchievementTier;
  symbol: AchievementSymbol;
  status: AchievementStatus;
  progress: { current: number; target: number };
}

interface AchievementDefinition extends Omit<AchievementProjection, "status" | "progress"> {
  measure(snapshot: LearningSnapshot): AchievementProjection["progress"];
}

const moduleIds = (start: number, end: number) => Array.from(
  { length: end - start + 1 },
  (_, index) => asModuleId(`M${String(start + index).padStart(2, "0")}`),
);

function masteredCount(snapshot: LearningSnapshot, ids: ReturnType<typeof moduleIds>) {
  return ids.filter(id => snapshot.modules[id] === "MASTERED").length;
}

function recoveredActivities(snapshot: LearningSnapshot) {
  const reviewAt = new Map<string, number>();
  const recovered = new Set<string>();
  [...snapshot.attempts]
    .sort((left, right) => left.recordedAt.localeCompare(right.recordedAt))
    .forEach(attempt => {
      const key = `${attempt.moduleId}:${attempt.activityId}`;
      if (attempt.outcome === "NEEDS_REVIEW") reviewAt.set(key, Date.parse(attempt.recordedAt));
      if (attempt.outcome === "COMPLETED" && reviewAt.has(key) && Date.parse(attempt.recordedAt) >= reviewAt.get(key)!) recovered.add(key);
    });
  return recovered.size;
}

const definitions: AchievementDefinition[] = [
  {
    id: "first-signal", name: "Primeiro Sinal", description: "Seu primeiro programa respondeu e abriu a jornada.", evidenceLabel: "Introdução do M01 concluída", category: "milestone", tier: "bronze", symbol: "signal",
    measure: snapshot => ({ current: snapshot.introductions[asModuleId("M01")] === "INTRODUCTION_COMPLETED" ? 1 : 0, target: 1 }),
  },
  {
    id: "first-build", name: "Primeira Construção", description: "Você transformou uma explicação em prática.", evidenceLabel: "Primeira aula praticada", category: "milestone", tier: "bronze", symbol: "tools",
    measure: snapshot => ({ current: Object.values(snapshot.lessons).some(item => item?.state === "PRACTICED" || item?.state === "MASTERED") ? 1 : 0, target: 1 }),
  },
  {
    id: "foundation-built", name: "Fundação Erguida", description: "Variáveis, valores e operações agora sustentam sua formação.", evidenceLabel: "M01 dominado", category: "mastery", tier: "silver", symbol: "shield",
    measure: snapshot => ({ current: snapshot.modules[asModuleId("M01")] === "MASTERED" ? 1 : 0, target: 1 }),
  },
  {
    id: "full-cycle", name: "Ciclo Completo", description: "Você percorreu introdução, aula, prática e domínio.", evidenceLabel: "Ciclo acadêmico do M01 completo", category: "milestone", tier: "gold", symbol: "cycle",
    measure: snapshot => ({
      current: [
        snapshot.introductions[asModuleId("M01")] === "INTRODUCTION_COMPLETED",
        Object.values(snapshot.lessons).some(item => item?.moduleId === asModuleId("M01") && (item.state === "PRACTICED" || item.state === "MASTERED")),
        snapshot.modules[asModuleId("M01")] === "MASTERED",
      ].filter(Boolean).length,
      target: 3,
    }),
  },
  {
    id: "learned-from-error", name: "Erro que Virou Aprendizado", description: "Você revisou uma dificuldade e voltou com uma solução.", evidenceLabel: "Atividade recuperada após precisar de revisão", category: "growth", tier: "silver", symbol: "spark",
    measure: snapshot => ({ current: Math.min(recoveredActivities(snapshot), 1), target: 1 }),
  },
  {
    id: "arena-explorer", name: "Explorador da Arena", description: "Você começou a aplicar conhecimento em problemas novos.", evidenceLabel: "3 desafios da Arena dominados", category: "challenge", tier: "bronze", symbol: "compass",
    measure: snapshot => ({ current: Math.min(Object.values(snapshot.challenges).filter(item => item?.state === "MASTERED").length, 3), target: 3 }),
  },
  {
    id: "arena-champion", name: "Campeão da Arena", description: "Uma etapa inteira de desafios foi vencida.", evidenceLabel: "6 desafios da Arena dominados", category: "challenge", tier: "gold", symbol: "cup",
    measure: snapshot => ({ current: Math.min(Object.values(snapshot.challenges).filter(item => item?.state === "MASTERED").length, 6), target: 6 }),
  },
  {
    id: "function-architect", name: "Arquiteto de Funções", description: "Parâmetros, retorno e composição viraram ferramentas reais.", evidenceLabel: "M07 dominado", category: "mastery", tier: "gold", symbol: "function",
    measure: snapshot => ({ current: snapshot.modules[asModuleId("M07")] === "MASTERED" ? 1 : 0, target: 1 }),
  },
  {
    id: "solid-base", name: "Base Consolidada", description: "Seis módulos formam uma fundação confiável.", evidenceLabel: "Módulos M01 a M06 dominados", category: "mastery", tier: "gold", symbol: "foundation",
    measure: snapshot => ({ current: masteredCount(snapshot, moduleIds(1, 6)), target: 6 }),
  },
  {
    id: "backend-bound", name: "Rumo ao Backend", description: "A linguagem já está pronta para encontrar o servidor.", evidenceLabel: "Módulos M01 a M07 dominados", category: "milestone", tier: "platinum", symbol: "rocket",
    measure: snapshot => ({ current: masteredCount(snapshot, moduleIds(1, 7)), target: 7 }),
  },
  {
    id: "formation-specialist", name: "Especialista em Formação", description: "Você concluiu a primeira grande trilha JavaScript do Campus.", evidenceLabel: "Módulos M01 a M12 dominados", category: "mastery", tier: "platinum", symbol: "crown",
    measure: snapshot => ({ current: masteredCount(snapshot, moduleIds(1, 12)), target: 12 }),
  },
];

export function evaluateAchievements(snapshot: LearningSnapshot): AchievementProjection[] {
  return definitions.map(({ measure, ...definition }) => {
    const progress = measure(snapshot);
    const status: AchievementStatus = progress.current >= progress.target
      ? "earned"
      : progress.current > 0
        ? "in-progress"
        : "locked";
    return { ...definition, status, progress };
  });
}
