import type { AchievementProjection } from "@/achievements/achievementCatalog";
import styles from "./masteryHall.module.css";

const marks: Record<AchievementProjection["symbol"], React.ReactNode> = {
  signal: <><path d="M32 46V29"/><path d="M24 37a11 11 0 0 1 16 0"/><path d="M18 30a20 20 0 0 1 28 0"/><circle cx="32" cy="49" r="3"/></>,
  tools: <><path d="m20 43 22-22"/><path d="m18 22 7 7-6 6-7-7z"/><path d="m39 35 8 8-5 5-8-8"/></>,
  shield: <><path d="M32 14 47 20v11c0 10-6 17-15 21-9-4-15-11-15-21V20z"/><path d="m25 32 5 5 10-11"/></>,
  cycle: <><path d="M45 25a15 15 0 0 0-25-4l-4 5"/><path d="M16 18v8h8"/><path d="M19 39a15 15 0 0 0 25 4l4-5"/><path d="M48 46v-8h-8"/></>,
  spark: <><path d="m32 13 4 13 13 4-13 4-4 14-4-14-13-4 13-4z"/><path d="m47 14 1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5z"/></>,
  compass: <><circle cx="32" cy="32" r="18"/><path d="m39 24-4 11-11 5 5-12z"/></>,
  cup: <><path d="M22 17h20v10c0 8-4 13-10 13s-10-5-10-13z"/><path d="M22 22h-7v4c0 6 4 9 10 9M42 22h7v4c0 6-4 9-10 9M32 40v7M24 51h16"/></>,
  function: <><path d="M40 16h-5c-5 0-7 4-8 10l-4 22c-1 4-3 6-7 6h-2"/><path d="M20 32h18"/><path d="m40 38 8-12M40 26l8 12"/></>,
  foundation: <><path d="M14 48h36M18 40h28M22 32h20M17 25l15-10 15 10z"/><path d="M25 27v13M32 27v13M39 27v13"/></>,
  rocket: <><path d="M27 38c-7 1-10 5-11 11 6-1 10-4 11-11z"/><path d="M26 38c-2-7 0-15 6-21 6-6 13-7 17-6 1 4 0 11-6 17-6 6-14 8-21 6z"/><circle cx="39" cy="21" r="4"/></>,
  crown: <><path d="m14 23 9 8 9-16 9 16 9-8-4 24H18z"/><path d="M20 41h24"/></>,
};

export function TrophyMedallion({ achievement, large = false }: { achievement: AchievementProjection; large?: boolean }) {
  return (
    <div className={`${styles.medallion} ${styles[achievement.tier]} ${styles[achievement.status]} ${large ? styles.largeMedallion : ""}`}>
      <svg viewBox="0 0 64 64" role="img" aria-label={`${achievement.name}: ${achievement.status === "earned" ? "conquistada" : achievement.status === "in-progress" ? "em progresso" : "bloqueada"}`}>
        <title>{achievement.name}</title>
        <circle className={styles.medallionCore} cx="32" cy="32" r="27" />
        <circle className={styles.medallionRing} cx="32" cy="32" r="23" />
        <g className={styles.medallionMark}>{marks[achievement.symbol]}</g>
      </svg>
    </div>
  );
}
