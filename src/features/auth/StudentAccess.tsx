"use client";

import { FormEvent, ReactNode, useState } from "react";
import { ArrowRight, BookOpen, LockKeyhole, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type StudentAccessProps = { children: ReactNode };

export function StudentAccess({ children }: StudentAccessProps) {
  const { data: session, isPending } = authClient.useSession();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isPending) {
    return <main className="auth-shell"><section className="panel auth-card"><span className="eyebrow">CAMPUS BACKEND</span><h1>Preparando seu espaço de estudo…</h1><p>Estamos carregando seu progresso.</p></section></main>;
  }

  if (session) return <>{children}</>;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = mode === "sign-in"
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ name, email, password });

    if (result.error) setError(result.error.message ?? "Não foi possível concluir o acesso.");
    setIsSubmitting(false);
  }

  return (
    <main className="auth-shell">
      <section className="panel auth-card">
        <div className="auth-brand"><div className="brand-mark">JS</div><div><strong>Campus Backend</strong><span>Curso aberto de JavaScript Backend</span></div></div>
        <div className="auth-copy"><span className="eyebrow">APRENDIZAGEM ABERTA</span><h1>{mode === "sign-in" ? "Continue sua jornada." : "Comece sua jornada."}</h1><p>Aprenda JavaScript com aulas, laboratório, desafios e uma lousa que explica o código passo a passo.</p></div>
        <div className="auth-tabs" role="tablist" aria-label="Acesso do aluno">
          <button type="button" className={mode === "sign-in" ? "active" : ""} onClick={() => setMode("sign-in")}>Entrar</button>
          <button type="button" className={mode === "sign-up" ? "active" : ""} onClick={() => setMode("sign-up")}>Criar conta</button>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "sign-up" && <label><span>Seu nome</span><div className="auth-input"><UserRound size={17}/><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required /></div></label>}
          <label><span>E-mail</span><div className="auth-input"><BookOpen size={17}/><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div></label>
          <label><span>Senha</span><div className="auth-input"><LockKeyhole size={17}/><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={8} required /></div></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="btn btn-primary full" disabled={isSubmitting}>{isSubmitting ? "Aguarde…" : mode === "sign-in" ? "Entrar no Campus" : "Criar meu acesso"}<ArrowRight size={16}/></button>
        </form>
        <p className="auth-note">Seu progresso será salvo na sua conta e ficará disponível em qualquer dispositivo.</p>
      </section>
    </main>
  );
}
