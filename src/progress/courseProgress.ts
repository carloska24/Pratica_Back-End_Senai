import type { CourseModule } from "@/course/course";
import type { CampusProgress } from "@/progress/useCampusProgress";

export function getCourseModuleView(
  module: CourseModule,
  progress: CampusProgress,
): CourseModule {
  if (module.id === "M07" && progress.m07Mastered) return { ...module, status: "concluido", progress: 100, note: "Domínio comprovado no Laboratório: os quatro casos de teste da missão final foram aprovados." };
  if (module.id === "M08" && progress.m08Mastered) return { ...module, status: "concluido", progress: 100, note: "Domínio comprovado no Laboratório: os seis casos da missão de Arrays foram aprovados." };
  if (module.id === "M08" && progress.m07Mastered) return { ...module, status: "andamento", progress: 72, note: "Arrays liberado: quatro aulas visuais, três exercícios e um desafio final disponível no Laboratório." };
  if (module.id === "M09" && progress.m09Mastered) return { ...module, status: "concluido", progress: 100, note: "Domínio comprovado no Laboratório: os seis casos da missão de Objetos foram aprovados." };
  if (module.id === "M09" && progress.m08Mastered) return { ...module, status: "andamento", progress: 72, note: "Objetos JavaScript liberado: quatro aulas visuais, três exercícios e uma missão final disponível no Laboratório." };
  if (module.id === "M10" && progress.m10Mastered) return { ...module, status: "concluido", progress: 100, note: "Domínio comprovado no Laboratório: os seis casos da missão de Strings, Math e Date foram aprovados." };
  if (module.id === "M10" && progress.m09Mastered) return { ...module, status: "andamento", progress: 72, note: "Strings, Math e Date liberado: quatro aulas visuais, três exercícios e uma missão final disponível no Laboratório." };
  if (module.id === "M11" && progress.m11Mastered) return { ...module, status: "concluido", progress: 100, note: "Domínio comprovado no Laboratório: os oito casos da missão de Arrays modernos foram aprovados." };
  if (module.id === "M11" && progress.m10Mastered) return { ...module, status: "andamento", progress: 72, note: "Arrays modernos liberado: cinco aulas visuais, quatro exercícios e uma missão final disponível no Laboratório." };
  if (module.id === "M12" && progress.m12Mastered) return { ...module, status: "concluido", progress: 100, note: "Domínio comprovado no Laboratório: os oito casos da missão de JavaScript moderno foram aprovados." };
  if (module.id === "M12" && progress.m11Mastered) return { ...module, status: "andamento", progress: 72, note: "JavaScript moderno liberado: cinco aulas visuais, quatro exercícios e uma missão final disponível no Laboratório." };
  if (module.id === "M13" && progress.m12Mastered) return { ...module, note: "Próximo ponto de retomada: Módulos e organização com import, export e ES Modules." };
  return module;
}
