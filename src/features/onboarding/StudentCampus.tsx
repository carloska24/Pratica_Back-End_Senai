"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, BookOpen, CheckCircle2, ChevronRight, GraduationCap, LayoutDashboard, LockKeyhole, Sparkles, Trophy } from "lucide-react";
import { evaluateAchievements } from "@/achievements/achievementCatalog";
import { completedModules, plannedModules } from "@/course/course";
import { courseLibrary } from "@/course/courseLibrary";
import { MasteryHall } from "@/features/achievements/MasteryHall";
import LessonDetail from "@/features/classroom/LessonDetail";
import type { LearningSnapshot } from "@/learning/contracts";
import type { StudentProfile } from "@/student/contracts";
import styles from "./onboarding.module.css";

type StudentView = "dashboard" | "curriculum" | "lesson" | "achievements";

export function StudentCampus({ profile, snapshot }: { profile: StudentProfile; snapshot: LearningSnapshot }) {
  const [view, setView] = useState<StudentView>("lesson");
  const contentRef = useRef<HTMLDivElement>(null);
  const modules = [...completedModules, ...plannedModules];
  const mastered = modules.filter(module => snapshot.modules[module.id as keyof typeof snapshot.modules] === "MASTERED").length;
  const percentage = Math.round(mastered / modules.length * 100);
  const m01 = courseLibrary.find(module => module.id === "M01")!;
  const lesson = m01.items.find(item => item.id === "M01-A01")!;
  const achievements = evaluateAchievements(snapshot);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [view]);

  return (
    <main className={styles.studentShell}>
      <aside className={styles.studentSidebar}>
        <div className={styles.brand}><span>JS</span><strong>Campus Backend</strong></div>
        <nav aria-label="Navegação do aluno">
          <button className={view === "dashboard" ? styles.activeNav : ""} onClick={() => setView("dashboard")}><LayoutDashboard /> Visão geral</button>
          <button className={view === "curriculum" ? styles.activeNav : ""} onClick={() => setView("curriculum")}><GraduationCap /> Grade curricular</button>
          <button className={view === "lesson" ? styles.activeNav : ""} onClick={() => setView("lesson")}><BookOpen /> Sala de aula</button>
          <button className={view === "achievements" ? styles.activeNav : ""} onClick={() => setView("achievements")}><Trophy /> Conquistas</button>
        </nav>
        <div className={styles.studentFocus}><span>FOCO DESTA ETAPA</span><strong>M01 · Fundamentos</strong></div>
        <div className={styles.studentIdentity}><span>{profile.initials}</span><div><b>{profile.displayName}</b><small>Início da formação</small></div></div>
      </aside>
      <section className={styles.studentWorkspace}>
        <header className={styles.studentTopbar}><span>FORMAÇÃO / BACKEND JAVASCRIPT</span><div><b>M01 · Fundamentos</b><em><Sparkles /> Progresso local</em><i>{profile.initials}</i></div></header>
        <div className={styles.studentContent} ref={contentRef}>
          {view === "lesson" && <section className={styles.studentLesson}>
            <div className={styles.lessonOrientation}><div><span>COMO ESTUDAR ESTA AULA</span><strong>Comece pela história, acompanhe o passo a passo e só depois observe o código.</strong></div><button onClick={() => document.getElementById("student-lesson-content")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Começar pela explicação <ArrowDown /></button></div>
            <div id="student-lesson-content"><LessonDetail module={m01} item={lesson} context="current" lessonNumber="Aula 01" /></div>
          </section>}
          {view === "dashboard" && <section className={styles.studentDashboard}>
            <p className={styles.eyebrow}>BEM-VINDO AO SEU CAMPUS</p><h1>{profile.displayName.split(" ")[0]}, sua base começa agora.</h1><p>Você concluiu a Porta do M01 e já executou seu primeiro programa. O próximo passo é compreender variáveis, valores e tipos.</p>
            <div className={styles.zeroProgress}><strong>{percentage}% concluído</strong><span>{mastered} de {modules.length} módulos dominados</span></div>
            <button className={styles.primaryAction} onClick={() => setView("lesson")}>Continuar Aula 01 <ChevronRight /></button>
          </section>}
          {view === "curriculum" && <section className={styles.studentCurriculum}><header><p className={styles.eyebrow}>GRADE CURRICULAR</p><h1>Da primeira variável ao projeto Backend.</h1></header><div>{modules.map((module, index) => {
            const state = snapshot.modules[module.id as keyof typeof snapshot.modules];
            const current = module.id === snapshot.position.moduleId;
            return <article key={module.id} className={current ? styles.currentModule : ""}><span>{module.id}</span><div><b>{module.title}</b><small>{current ? "Em andamento" : state === "MASTERED" ? "Dominado" : index === 0 ? "Disponível" : "Bloqueado por enquanto"}</small></div>{state === "MASTERED" ? <CheckCircle2 /> : current ? <BookOpen /> : <LockKeyhole />}</article>;
          })}</div></section>}
          {view === "achievements" && <MasteryHall studentName={profile.displayName} achievements={achievements} />}
        </div>
      </section>
    </main>
  );
}
