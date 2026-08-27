import { courseLibrary } from "@/course/courseLibrary";
import type { LabModuleId } from "@/runner/contracts";

export const lessonSequence = courseLibrary.flatMap(module =>
  module.items
    .filter(item => item.kind === "aula")
    .map((item, lessonIndex) => ({
      moduleId: module.id,
      moduleTitle: module.title,
      lessonId: item.id,
      lessonTitle: item.title,
      lessonIndex,
      summary: item.summary,
    })),
);

export type LessonStep = "explanation" | "board" | "checkpoint" | "exercise" | "complete";

export type LessonProgressRecord = {
  moduleId: string;
  lessonId: string;
  explanationDone: boolean;
  boardDone: boolean;
  checkpointDone: boolean;
  exerciseDone: boolean;
  completed: boolean;
};

export type StudentProgressSummary = {
  records: LessonProgressRecord[];
  currentLessonId: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
};

export function findLesson(lessonId: string) {
  return lessonSequence.find(lesson => lesson.lessonId === lessonId);
}

export function firstPendingLesson(records: LessonProgressRecord[]) {
  const completed = new Set(records.filter(record => record.completed).map(record => record.lessonId));
  return lessonSequence.find(lesson => !completed.has(lesson.lessonId)) ?? lessonSequence.at(-1)!;
}

export function modulePercentage(moduleId: string, records: LessonProgressRecord[]) {
  const lessons = getModuleLessons(moduleId);
  if (!lessons.length) return 0;
  const completed = new Set(records.filter(record => record.completed).map(record => record.lessonId));
  return Math.round(lessons.filter(lesson => completed.has(lesson.lessonId)).length / lessons.length * 100);
}

export function getModuleLessons(moduleId: string) {
  return lessonSequence.filter(lesson => lesson.moduleId === moduleId);
}

export function isModuleCompletionUnlocked(moduleId: string, records: LessonProgressRecord[]) {
  const moduleIndex = courseLibrary.findIndex(module => module.id === moduleId);
  if (moduleIndex < 0) return false;
  if (moduleIndex === 0) return true;
  return modulePercentage(courseLibrary[moduleIndex - 1].id, records) === 100;
}

export function createCompletedModuleRecords(moduleId: string, records: LessonProgressRecord[]): LessonProgressRecord[] {
  const existingByLesson = new Map(records.map(record => [record.lessonId, record]));
  return getModuleLessons(moduleId).map(lesson => ({
    ...existingByLesson.get(lesson.lessonId),
    moduleId,
    lessonId: lesson.lessonId,
    explanationDone: true,
    boardDone: true,
    checkpointDone: true,
    exerciseDone: true,
    completed: true,
  }));
}

export function availableLabModuleIds(records: LessonProgressRecord[]): LabModuleId[] {
  const currentModuleId = firstPendingLesson(records).moduleId;

  return courseLibrary
    .map(module => module.id)
    .filter((moduleId): moduleId is LabModuleId => /^M(?:0[1-9]|1[0-2])$/.test(moduleId))
    .filter(moduleId => moduleId === currentModuleId || modulePercentage(moduleId, records) === 100);
}

export function isLessonUnlocked(lessonId: string, records: LessonProgressRecord[]) {
  const index = lessonSequence.findIndex(lesson => lesson.lessonId === lessonId);
  if (index <= 0) return index === 0;
  return records.some(record => record.lessonId === lessonSequence[index - 1].lessonId && record.completed);
}

export function createSummary(records: LessonProgressRecord[]): StudentProgressSummary {
  const completedLessons = records.filter(record => record.completed).length;
  const totalLessons = lessonSequence.length;
  return {
    records,
    currentLessonId: firstPendingLesson(records).lessonId,
    completedLessons,
    totalLessons,
    percentage: totalLessons ? Math.round(completedLessons / totalLessons * 100) : 0,
  };
}
