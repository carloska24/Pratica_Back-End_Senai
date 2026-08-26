import type { CourseModule } from "@/course/course";
import { courseLibrary } from "@/course/courseLibrary";
import { modulePercentage, type LessonProgressRecord } from "@/progress/catalog";

export function getStudentModuleView(module: CourseModule, records: LessonProgressRecord[]): CourseModule {
  const curriculumIndex = courseLibrary.findIndex(item => item.id === module.id);
  if (curriculumIndex < 0) return { ...module, status: "planejado", progress: 0 };

  const progress = modulePercentage(module.id, records);
  const previousModule = curriculumIndex > 0 ? courseLibrary[curriculumIndex - 1] : null;
  const unlocked = curriculumIndex === 0 || (previousModule ? modulePercentage(previousModule.id, records) === 100 : false);

  return {
    ...module,
    progress,
    status: progress === 100 ? "concluido" : unlocked ? "andamento" : "planejado",
    note: progress === 100
      ? "Módulo concluído por este aluno. Todo o conteúdo continua disponível para revisão."
      : unlocked
        ? "Módulo atual da jornada individual do aluno."
        : `Conteúdo bloqueado até a conclusão de ${previousModule?.id ?? "etapa anterior"}.`,
  };
}
