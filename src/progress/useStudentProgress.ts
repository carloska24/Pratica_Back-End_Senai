"use client";

import { useCallback, useEffect, useState } from "react";
import { lessonSequence, type LessonStep, type StudentProgressSummary } from "@/progress/catalog";

const emptySummary: StudentProgressSummary = {
  records: [],
  currentLessonId: lessonSequence[0]?.lessonId ?? "M01-A01",
  completedLessons: 0,
  totalLessons: lessonSequence.length,
  percentage: 0,
};

export function useStudentProgress() {
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/progress", { cache: "no-store" });
      if (!response.ok) throw new Error("Não foi possível carregar seu progresso.");
      setSummary(await response.json() as StudentProgressSummary);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar seu progresso.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const markStep = useCallback(async (lessonId: string, step: LessonStep) => {
    setSaving(true);
    try {
      const response = await fetch("/api/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, step }),
      });
      const body = await response.json() as StudentProgressSummary | { message?: string };
      if (!response.ok) throw new Error("message" in body && body.message ? body.message : "Não foi possível salvar o progresso.");
      setSummary(body as StudentProgressSummary);
      setError("");
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível salvar o progresso.");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { ...summary, loading, saving, error, refresh, markStep };
}
