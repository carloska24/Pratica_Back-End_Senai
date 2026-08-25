"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, BookOpen, Code2, GraduationCap, MonitorSmartphone } from "lucide-react";
import styles from "./onboarding.module.css";

export type EntryProfile = {
  id: string;
  displayName: string;
  initials: string;
};

type EntryPortalProps = {
  profiles: readonly EntryProfile[];
  onCreateProfile: (displayName: string) => void | Promise<void>;
  onActivateProfile: (studentId: string) => void | Promise<void>;
  busy?: boolean;
  error?: string | null;
};

export function EntryPortal({ profiles, onCreateProfile, onActivateProfile, busy = false, error }: EntryPortalProps) {
  const [displayName, setDisplayName] = useState("");
  const normalizedName = displayName.trim().replace(/\s+/g, " ");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (normalizedName.length < 2 || busy) return;
    void onCreateProfile(normalizedName);
  };

  return (
    <main className={styles.entryShell}>
      <a className={styles.skipLink} href="#entry-form">Pular para criar perfil</a>
      <section className={styles.entryStory} aria-labelledby="entry-title">
        <div className={styles.brand}><span>JS</span><strong>Campus Backend</strong></div>
        <p className={styles.eyebrow}>PORTAL DE ENTRADA · FORMAÇÃO ABERTA</p>
        <h1 id="entry-title">Comece do zero.<br />Entenda a lógica.<br /><em>Chegue ao Backend.</em></h1>
        <p className={styles.lead}>Uma rota visual e prática para aprender JavaScript sem pular fundamentos — sempre sabendo onde você está e qual é o próximo passo.</p>
        <ol className={styles.route} aria-label="Jornada de aprendizagem">
          <li><span><BookOpen /></span><b>M01</b><small>Fundamentos</small></li>
          <li><span><GraduationCap /></span><b>Aula</b><small>Compreender</small></li>
          <li><span><Code2 /></span><b>Lab</b><small>Experimentar</small></li>
          <li><span><ArrowRight /></span><b>Backend</b><small>Construir</small></li>
        </ol>
      </section>

      <section className={styles.entryPanel} id="entry-form" aria-labelledby="profile-title">
        <div className={styles.panelHeading}>
          <p className={styles.eyebrow}>PREPARE SEU CAMPUS</p>
          <h2 id="profile-title">Sua trilha começa aqui.</h2>
          <p>Crie um perfil de estudo separado. Você começará no M01, sem progresso ou conquistas herdadas.</p>
        </div>

        {profiles.length > 0 && (
          <div className={styles.savedProfiles}>
            <h3>Continuar estudando</h3>
            {profiles.map(profile => (
              <button key={profile.id} type="button" onClick={() => void onActivateProfile(profile.id)} disabled={busy} aria-label={`Continuar como ${profile.displayName}`}>
                <span className={styles.profileAvatar}>{profile.initials}</span>
                <span><b>{profile.displayName}</b><small>Perfil neste navegador</small></span>
                <ArrowRight aria-hidden="true" />
              </button>
            ))}
            <div className={styles.divider}><span>ou crie outro perfil</span></div>
          </div>
        )}

        <form onSubmit={submit} className={styles.profileForm}>
          <label htmlFor="student-name">Como devemos chamar você?</label>
          <p id="name-help">Use seu primeiro nome ou o nome que prefere ver nas aulas.</p>
          <input id="student-name" aria-describedby="name-help" autoComplete="name" maxLength={60} value={displayName} onChange={event => setDisplayName(event.target.value)} placeholder="Ex.: Ana Silva" />
          <button className={styles.primaryAction} disabled={normalizedName.length < 2 || busy} type="submit">
            {busy ? "Preparando seu Campus…" : "Criar meu perfil local"}<ArrowRight aria-hidden="true" />
          </button>
        </form>

        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.localNotice}><MonitorSmartphone /><p><b>Salvo somente neste navegador.</b><span>Este perfil local ainda não é uma conta e não sincroniza entre dispositivos. Limpar os dados do navegador ou usar uma janela anônima pode apagar o progresso.</span></p></div>
      </section>
    </main>
  );
}
