"use client";

import { useEffect, useMemo, useState } from "react";
import { LocalProgressRepository } from "@/learning/localProgressRepository";
import { asCourseId, asLessonId, asModuleId, asOperationId } from "@/learning/ids";
import type { LearningScope, LearningSnapshot } from "@/learning/contracts";
import { LocalStudentRepository } from "@/student/localStudentRepository";
import { asStudentId } from "@/student/ids";
import type { StudentProfile } from "@/student/contracts";
import { EntryPortal } from "./EntryPortal";
import { ModuleIntroduction } from "./ModuleIntroduction";
import { StudentCampus } from "./StudentCampus";
import styles from "./onboarding.module.css";

const COURSE_ID = asCourseId("javascript-backend");
const COURSE_VERSION = "2026.1";
const M01 = asModuleId("M01");
const M01_A01 = asLessonId("M01-A01");

function operationId(prefix: string) {
  return asOperationId(`${prefix}-${crypto.randomUUID()}`);
}

export function StudentExperience() {
  const students = useMemo(() => typeof window === "undefined" ? null : new LocalStudentRepository(), []);
  const progress = useMemo(() => typeof window === "undefined" ? null : new LocalProgressRepository(), []);
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [snapshot, setSnapshot] = useState<LearningSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scopeFor = (student: StudentProfile): LearningScope => ({ studentId: student.id, courseId: COURSE_ID, courseVersion: COURSE_VERSION });

  useEffect(() => {
    if (!students || !progress) return;
    let active = true;
    void (async () => {
      try {
        const [savedProfiles, activeProfile] = await Promise.all([students.listProfiles(), students.getActiveProfile()]);
        if (!active) return;
        setProfiles(savedProfiles);
        setProfile(activeProfile);
        if (activeProfile) setSnapshot(await progress.load(scopeFor(activeProfile)));
      } catch {
        if (active) setError("Não foi possível ler os perfis deste navegador. Verifique se o armazenamento local está disponível.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [progress, students]);

  const createProfile = async (displayName: string) => {
    if (!students || !progress) return;
    setBusy(true); setError(null);
    try {
      const created = await students.createProfile({ displayName });
      let next = await progress.load(scopeFor(created));
      next = await progress.apply(scopeFor(created), { type: "START_MODULE_INTRODUCTION", operationId: operationId("intro-start"), moduleId: M01 }, next.revision);
      const updated = await students.updateProfile(created.id, { onboardingStatus: "IN_PROGRESS" });
      setProfiles(await students.listProfiles()); setProfile(updated); setSnapshot(next);
    } catch { setError("Não foi possível criar o perfil. Tente novamente neste navegador."); }
    finally { setBusy(false); }
  };

  const activateProfile = async (studentId: string) => {
    if (!students || !progress) return;
    setBusy(true); setError(null);
    try {
      const id = asStudentId(studentId);
      await students.activateProfile(id);
      const active = await students.getActiveProfile();
      if (!active) throw new Error("Active profile not found");
      setProfile(active); setSnapshot(await progress.load(scopeFor(active)));
    } catch { setError("Não foi possível abrir esse perfil."); }
    finally { setBusy(false); }
  };

  const completeIntroduction = async () => {
    if (!students || !progress || !profile || !snapshot) return;
    setBusy(true); setError(null);
    try {
      let next = await progress.apply(scopeFor(profile), { type: "COMPLETE_MODULE_INTRODUCTION", operationId: operationId("intro-complete"), moduleId: M01 }, snapshot.revision);
      next = await progress.apply(scopeFor(profile), { type: "START_LESSON", operationId: operationId("lesson-start"), moduleId: M01, lessonId: M01_A01 }, next.revision);
      const updated = await students.updateProfile(profile.id, { onboardingStatus: "COMPLETED" });
      setProfile(updated); setSnapshot(next);
    } catch { setError("Não foi possível salvar este passo. Sua execução continua visível; tente abrir a aula novamente."); }
    finally { setBusy(false); }
  };

  if (loading) return <main className={styles.loadingState} aria-live="polite">Preparando o Campus…</main>;
  if (!profile) return <EntryPortal profiles={profiles} onCreateProfile={createProfile} onActivateProfile={activateProfile} busy={busy} error={error} />;
  if (!snapshot) return <main className={styles.loadingState} role="alert">{error ?? "Não foi possível carregar o progresso deste perfil."}</main>;
  if (profile.onboardingStatus !== "COMPLETED" || snapshot.introductions[M01] !== "INTRODUCTION_COMPLETED") {
    return <><ModuleIntroduction studentName={profile.displayName} onComplete={completeIntroduction} busy={busy} />{error && <p className={styles.floatingError} role="alert">{error}</p>}</>;
  }
  return <StudentCampus profile={profile} snapshot={snapshot} />;
}
