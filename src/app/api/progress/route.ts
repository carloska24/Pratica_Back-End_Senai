import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { studentProgress } from "@/lib/db/schema";
import {
  createSummary,
  createCompletedModuleRecords,
  findLesson,
  isLessonUnlocked,
  isModuleCompletionUnlocked,
  type LessonProgressRecord,
  type LessonStep,
} from "@/progress/catalog";

export const runtime = "nodejs";

function toRecord(row: typeof studentProgress.$inferSelect): LessonProgressRecord | null {
  if (!row.lessonId) return null;
  return {
    moduleId: row.moduleId,
    lessonId: row.lessonId,
    explanationDone: row.explanationDone,
    boardDone: row.boardDone,
    checkpointDone: row.checkpointDone,
    exerciseDone: row.exerciseDone,
    completed: row.status === "completed",
  };
}

async function getAuthenticatedUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

async function readUserProgress(userId: string) {
  if (!db) return [];
  const rows = await db.select().from(studentProgress).where(eq(studentProgress.userId, userId));
  return rows.map(toRecord).filter((record): record is LessonProgressRecord => record !== null);
}

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) return Response.json({ message: "Não autenticado." }, { status: 401 });
  if (!db) return Response.json({ message: "Banco de dados indisponível." }, { status: 503 });

  return Response.json(createSummary(await readUserProgress(user.id)));
}

export async function PATCH(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) return Response.json({ message: "Não autenticado." }, { status: 401 });
  if (!db) return Response.json({ message: "Banco de dados indisponível." }, { status: 503 });
  const database = db;

  const payload = await request.json().catch(() => null) as { lessonId?: string; step?: LessonStep; moduleId?: string; action?: string } | null;
  if (payload?.action === "complete-module") {
    const moduleId = payload.moduleId?.trim();
    if (!moduleId) {
      return Response.json({ message: "Módulo inválido." }, { status: 400 });
    }

    const records = await readUserProgress(user.id);
    if (!isModuleCompletionUnlocked(moduleId, records)) {
      return Response.json({ message: "Conclua o módulo anterior antes de liberar esta etapa." }, { status: 409 });
    }

    const now = new Date();
    const completedRecords = createCompletedModuleRecords(moduleId, records);
    if (!completedRecords.length) {
      return Response.json({ message: "Este módulo não possui aulas para concluir." }, { status: 400 });
    }

    await Promise.all(completedRecords.map(record => database.insert(studentProgress).values({
      id: crypto.randomUUID(),
      userId: user.id,
      moduleId: record.moduleId,
      lessonId: record.lessonId,
      status: "completed",
      percentage: 100,
      explanationDone: true,
      boardDone: true,
      checkpointDone: true,
      exerciseDone: true,
      completedAt: now,
      updatedAt: now,
    }).onConflictDoUpdate({
      target: [studentProgress.userId, studentProgress.lessonId],
      set: {
        status: "completed",
        percentage: 100,
        explanationDone: true,
        boardDone: true,
        checkpointDone: true,
        exerciseDone: true,
        completedAt: now,
        updatedAt: now,
      },
    })));

    return Response.json(createSummary(await readUserProgress(user.id)));
  }

  const lesson = payload?.lessonId ? findLesson(payload.lessonId) : undefined;
  const allowedSteps: LessonStep[] = ["explanation", "board", "checkpoint", "exercise", "complete"];
  if (!lesson || !payload?.step || !allowedSteps.includes(payload.step)) {
    return Response.json({ message: "Aula ou etapa inválida." }, { status: 400 });
  }

  const records = await readUserProgress(user.id);
  if (!isLessonUnlocked(lesson.lessonId, records)) {
    return Response.json({ message: "Conclua a aula anterior antes de avançar." }, { status: 409 });
  }

  const current = records.find(record => record.lessonId === lesson.lessonId) ?? {
    moduleId: lesson.moduleId,
    lessonId: lesson.lessonId,
    explanationDone: false,
    boardDone: false,
    checkpointDone: false,
    exerciseDone: false,
    completed: false,
  };

  const next = {
    ...current,
    explanationDone: current.explanationDone || payload.step === "explanation",
    boardDone: current.boardDone || payload.step === "board",
    checkpointDone: current.checkpointDone || payload.step === "checkpoint",
    exerciseDone: current.exerciseDone || payload.step === "exercise",
  };
  const requirementsDone = next.explanationDone && next.boardDone && next.checkpointDone && next.exerciseDone;
  if (payload.step === "complete" && !requirementsDone) {
    return Response.json({ message: "Ainda existem requisitos obrigatórios pendentes." }, { status: 409 });
  }

  const completed = current.completed || payload.step === "complete";
  const now = new Date();
  await db.insert(studentProgress).values({
    id: crypto.randomUUID(),
    userId: user.id,
    moduleId: lesson.moduleId,
    lessonId: lesson.lessonId,
    status: completed ? "completed" : "in_progress",
    percentage: completed ? 100 : Math.round([
      next.explanationDone,
      next.boardDone,
      next.checkpointDone,
      next.exerciseDone,
    ].filter(Boolean).length / 4 * 100),
    explanationDone: next.explanationDone,
    boardDone: next.boardDone,
    checkpointDone: next.checkpointDone,
    exerciseDone: next.exerciseDone,
    completedAt: completed ? now : null,
    updatedAt: now,
  }).onConflictDoUpdate({
    target: [studentProgress.userId, studentProgress.lessonId],
    set: {
      status: completed ? "completed" : "in_progress",
      percentage: completed ? 100 : Math.round([
        next.explanationDone,
        next.boardDone,
        next.checkpointDone,
        next.exerciseDone,
      ].filter(Boolean).length / 4 * 100),
      explanationDone: next.explanationDone,
      boardDone: next.boardDone,
      checkpointDone: next.checkpointDone,
      exerciseDone: next.exerciseDone,
      completedAt: completed ? now : null,
      updatedAt: now,
    },
  });

  return Response.json(createSummary(await readUserProgress(user.id)));
}
