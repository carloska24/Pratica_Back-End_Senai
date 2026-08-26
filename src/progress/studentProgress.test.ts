import { describe, expect, it } from "vitest";
import { completedModules } from "@/course/course";
import { availableLabModuleIds, createSummary, isLessonUnlocked, lessonSequence, modulePercentage, type LessonProgressRecord } from "@/progress/catalog";
import { getStudentModuleView } from "@/progress/studentCourseView";

function completedRecord(lessonId: string): LessonProgressRecord {
  const lesson = lessonSequence.find(item => item.lessonId === lessonId)!;
  return {
    moduleId: lesson.moduleId,
    lessonId,
    explanationDone: true,
    boardDone: true,
    checkpointDone: true,
    exerciseDone: true,
    completed: true,
  };
}

describe("progressão individual do aluno", () => {
  it("inicia um aluno novo em M01 Aula 01 com zero por cento", () => {
    const summary = createSummary([]);
    expect(summary.currentLessonId).toBe("M01-A01");
    expect(summary.completedLessons).toBe(0);
    expect(summary.percentage).toBe(0);
    expect(getStudentModuleView(completedModules[0], []).status).toBe("andamento");
    expect(getStudentModuleView(completedModules[0], []).progress).toBe(0);
    expect(getStudentModuleView(completedModules[1], []).status).toBe("planejado");
  });

  it("libera somente a aula imediatamente seguinte", () => {
    const first = completedRecord("M01-A01");
    expect(isLessonUnlocked(lessonSequence[1].lessonId, [first])).toBe(true);
    expect(isLessonUnlocked(lessonSequence[2].lessonId, [first])).toBe(false);
  });

  it("calcula o módulo somente pelas aulas realmente concluídas", () => {
    const m01Lessons = lessonSequence.filter(lesson => lesson.moduleId === "M01");
    const records = m01Lessons.map(lesson => completedRecord(lesson.lessonId));
    expect(modulePercentage("M01", records)).toBe(100);
    expect(getStudentModuleView(completedModules[0], records).status).toBe("concluido");
    expect(getStudentModuleView(completedModules[1], records).status).toBe("andamento");
  });

  it("libera no laboratório apenas o módulo atual e os módulos concluídos", () => {
    expect(availableLabModuleIds([])).toEqual(["M01"]);

    const m01Records = lessonSequence
      .filter(lesson => lesson.moduleId === "M01")
      .map(lesson => completedRecord(lesson.lessonId));

    expect(availableLabModuleIds(m01Records)).toEqual(["M01", "M02"]);
  });
});
