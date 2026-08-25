"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, LockKeyhole, Sparkles, Target } from "lucide-react";
import type { AchievementCategory, AchievementProjection } from "@/achievements/achievementCatalog";
import { TrophyMedallion } from "./TrophyMedallion";
import styles from "./masteryHall.module.css";

const categoryLabels: Record<AchievementCategory, string> = {
  milestone: "Marcos da Jornada",
  mastery: "Domínio Técnico",
  growth: "Evolução",
  challenge: "Desafios",
};

const statusLabels = { earned: "Conquistada", "in-progress": "Em progresso", locked: "Bloqueada" } as const;

export function MasteryHall({ studentName, achievements }: { studentName: string; achievements: AchievementProjection[] }) {
  const firstHighlight = achievements.find(item => item.status === "earned") ?? achievements.find(item => item.status === "in-progress") ?? achievements[0];
  const [selectedId, setSelectedId] = useState(firstHighlight?.id);
  const selected = achievements.find(item => item.id === selectedId) ?? firstHighlight;
  const earned = achievements.filter(item => item.status === "earned").length;
  const groups = useMemo(() => Object.entries(categoryLabels).map(([category, label]) => ({
    category: category as AchievementCategory,
    label,
    items: achievements.filter(item => item.category === category),
  })).filter(group => group.items.length > 0), [achievements]);

  if (!selected) return null;

  return (
    <section className={styles.hall} aria-labelledby="mastery-hall-title">
      <header className={styles.hallHeader}>
        <div><p>SUA COLEÇÃO DE CONHECIMENTO</p><h1 id="mastery-hall-title">Salão de Maestria</h1><span>{studentName.split(" ")[0]}, cada peça abaixo representa algo que você realmente demonstrou.</span></div>
        <div className={styles.collectionScore} role="status" aria-label={`${earned} de ${achievements.length} conquistadas`}><strong>{earned}</strong><span>de {achievements.length} conquistadas</span></div>
      </header>

      <article className={`${styles.spotlight} ${styles[selected.tier]}`} aria-live="polite">
        <div className={styles.lightBeam} aria-hidden="true" />
        <div className={styles.trophyStage}><TrophyMedallion achievement={selected} large /></div>
        <div className={styles.spotlightCopy}>
          <div className={styles.spotlightHeading}>
            <span className={styles.status}><Sparkles /> {statusLabels[selected.status]}</span>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
          </div>
          <div className={styles.evidence}>
            {selected.status === "earned" ? <CheckCircle2 /> : selected.status === "locked" ? <LockKeyhole /> : <Target />}
            <div><small>{selected.status === "earned" ? "EVIDÊNCIA REGISTRADA" : "REQUISITO"}</small><strong>{selected.evidenceLabel}</strong></div>
          </div>
          <div className={styles.progressCopy}><span>{selected.progress.current} de {selected.progress.target} etapas</span><b>{Math.round(selected.progress.current / selected.progress.target * 100)}%</b></div>
          <div className={styles.progressTrack} aria-label={`Progresso de ${selected.name}: ${selected.progress.current} de ${selected.progress.target}`}><i style={{ width: `${selected.progress.current / selected.progress.target * 100}%` }} /></div>
        </div>
      </article>

      <div className={styles.collections}>
        {groups.map(group => <section key={group.category} aria-labelledby={`category-${group.category}`}>
          <header><div><span>{String(groups.indexOf(group) + 1).padStart(2, "0")}</span><h2 id={`category-${group.category}`}>{group.label}</h2></div><small>{group.items.filter(item => item.status === "earned").length}/{group.items.length}</small></header>
          <div className={styles.medalGrid}>
            {group.items.map(item => <button key={item.id} type="button" className={`${styles.medalCard} ${selected.id === item.id ? styles.selectedCard : ""}`} onClick={() => setSelectedId(item.id)} aria-label={`${item.name}, ${statusLabels[item.status].toLowerCase()}`} aria-pressed={selected.id === item.id}>
              <TrophyMedallion achievement={item} />
              <span><strong>{item.name}</strong><small>{statusLabels[item.status]}</small></span>
              {item.status === "locked" && <LockKeyhole className={styles.cardLock} aria-hidden="true" />}
            </button>)}
          </div>
        </section>)}
      </div>
    </section>
  );
}
