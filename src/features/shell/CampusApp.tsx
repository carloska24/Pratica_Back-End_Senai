"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Code2,
  Compass,
  FileCode2,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  Medal,
  Play,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Upload,
  UserRound,
  XCircle,
  RotateCcw,
  LibraryBig,
  BookMarked
} from "lucide-react";
import { completedModules, plannedModules, currentLesson, CourseModule } from "@/course/course";
import Classroom from "@/features/classroom/Classroom";
import PracticeArena from "@/features/practice/PracticeArena";
import { LabModulePicker } from "@/features/lab/LabModulePicker";
import { ExecutionWorkbench } from "@/features/lab/ExecutionWorkbench";
import { TeachingBoard } from "@/features/lab/TeachingBoard";
import { buildTutorRequest } from "@/features/lab/tutorPayload";
import { courseLibrary } from "@/course/courseLibrary";
import { useCampusProgress, type CampusProgress } from "@/progress/useCampusProgress";
import { getCourseModuleView } from "@/progress/courseProgress";
import { readMasteredModules } from "@/progress/storage";
import { analyzeJavaScript } from "@/runner/analyzer";
import { MAX_LOCAL_CODE_BYTES, runJavaScriptLocally } from "@/runner/browserRunner";
import type { ExecutionResult, LabModuleId, MissionId, TeachingAnalysis } from "@/runner/contracts";
import { labModules, resolveExecutionMission, resolveMissionValidation, starterCode } from "@/runner/missionCatalog";
import { tutorResponseSchema, type TutorResponse } from "@/tutor/schemas";
import type { ExecutionTrace } from "@/interpreter/contracts";
import { createInterpreterWorkerClient, type InterpreterWorkerExecution } from "@/interpreter/workerClient";

type View = "dashboard" | "trilha" | "aula" | "laboratorio" | "arena" | "conquistas" | "perfil";

const nav: { id: View; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: "dashboard", label: "Visão geral", icon: LayoutDashboard },
  { id: "trilha", label: "Grade curricular", icon: GraduationCap },
  { id: "aula", label: "Sala de aula", icon: BookOpen },
  { id: "laboratorio", label: "Laboratório", icon: Code2 },
  { id: "arena", label: "Arena de desafios", icon: Trophy },
  { id: "conquistas", label: "Conquistas", icon: Medal },
  { id: "perfil", label: "Desempenho", icon: BarChart3 },
];

function StatusPill({ status }: { status: CourseModule["status"] }) {
  const map = {
    concluido: ["Concluído", "ok"],
    andamento: ["Em andamento", "warn"],
    planejado: ["Planejado", "muted"]
  } as const;
  return <span className={`status status-${map[status][1]}`}>{map[status][0]}</span>;
}

function ProgressRing({ value }: { value: number }) {
  const deg = Math.round(value * 3.6);
  return (
    <div className="progress-ring" style={{ background: `conic-gradient(var(--accent) ${deg}deg, var(--line) ${deg}deg)` }}>
      <div className="progress-ring-inner"><strong>{value}%</strong><span>curso</span></div>
    </div>
  );
}

function Dashboard({ setView }: { setView: (v: View) => void }) {
  const modules = [...completedModules, ...plannedModules];
  const total = modules.length;
  const totalItems = courseLibrary.reduce((sum, module) => sum + module.items.length, 0);
  const progress = useCampusProgress();
  const moduleViews = modules.map(module => getCourseModuleView(module, progress));
  const verifiedFinished = moduleViews.filter(module => module.status === "concluido").length;
  const courseProgress = Math.round(moduleViews.reduce((sum, module) => sum + module.progress, 0) / total);
  const activeLesson = progress.m12Mastered ? {
    module: "M13 · Módulos e organização",
    lesson: "Cada arquivo com uma responsabilidade",
    checkpoint: "Sintaxe moderna consolidada: a próxima etapa separará funções e contratos entre arquivos JavaScript.",
    next: "Retomar futuramente pelo M13: import, export e ES Modules",
    index: "13.01",
  } : progress.m11Mastered ? {
    module: "M12 · JavaScript moderno",
    lesson: "A mesma função, uma escrita mais curta",
    checkpoint: "Callbacks dominados com function: agora a sintaxe moderna poderá encurtar o código sem esconder seu significado.",
    next: "Iniciar M12 comparando função tradicional e arrow function",
    index: "12.01",
  } : progress.m10Mastered ? {
    module: "M11 · Arrays modernos",
    lesson: "Percorrer com intenção",
    checkpoint: "Dados primitivos preparados: agora cada método de array expressará uma intenção específica sobre coleções.",
    next: "Iniciar M11 comparando for clássico e forEach",
    index: "11.01",
  } : progress.m09Mastered ? {
    module: "M10 · Strings, Math e Date",
    lesson: "Texto também é dado de negócio",
    checkpoint: "Objetos dominados: agora vamos transformar, calcular e formatar seus valores com precisão.",
    next: "Iniciar o M10 pela anatomia e transformação de strings",
    index: "10.01",
  } : progress.m08Mastered ? {
    module: "M09 · Objetos JavaScript",
    lesson: "Uma entidade com várias características",
    checkpoint: "Objeto reúne propriedades nomeadas; cada propriedade associa uma chave a um valor.",
    next: "Abrir a Aula01 e explorar produto.codigo, produto.nome e produto.preco",
    index: "09.01",
  } : progress.m07Mastered ? {
    module: "M08 · Arrays",
    lesson: "Uma lista dentro de uma caixinha",
    checkpoint: "Índice é o endereço do elemento; o primeiro índice é 0 e o último é length - 1.",
    next: "Abrir a Aula01 de Arrays na biblioteca do curso",
    index: "08.01",
  } : { ...currentLesson, index: "07.07" };

  return (
    <div className="view-grid dashboard-view">
      <section className="hero-panel panel panel-dark">
        <div className="eyebrow">FORMAÇÃO PREPARATÓRIA · JAVASCRIPT BACKEND</div>
        <div className="hero-copy">
          <div>
            <h1>JavaScript como linguagem principal.<br/>Lógica sólida para chegar ao Backend.</h1>
            <p>Um curso paralelo de estudos para reforçar lógica, praticar JavaScript e avançar dos fundamentos até Node.js, APIs e banco de dados.</p>
          </div>
          <div className="hero-side">
            <div className="language-seal"><b>JS</b><span>JavaScript<br/>Backend Track</span></div>
            <ProgressRing value={courseProgress} />
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => setView("aula")}><Play size={17}/> {progress.m12Mastered ? "Revisar M12" : "Continuar aula"}</button>
          <button className="btn btn-ghost-dark" onClick={() => setView("trilha")}><Compass size={17}/> Ver grade completa</button>
        </div>
      </section>

      <section className="metric-strip panel">
        <div className="metric"><span>Itens revisados</span><strong>{progress.reviews}/{totalItems}</strong><small>marcados por você na biblioteca</small></div>
        <div className="metric"><span>Exemplos de funções</span><strong>{progress.examples}/20</strong><small>mini-aulas concluídas</small></div>
        <div className="metric"><span>Desafios resolvidos</span><strong>{progress.challenges}/6</strong><small>respostas confirmadas na arena</small></div>
        <div className="metric"><span>Módulos concluídos</span><strong>{verifiedFinished}/{total}</strong><small>{progress.attempts} tentativa(s) registrada(s) no laboratório</small></div>
      </section>

      <section className="current-card panel">
        <div className="section-heading">
          <div><span className="eyebrow">AGORA</span><h2>{activeLesson.module}</h2></div>
          <span className="badge-live">{progress.m12Mastered ? <BookMarked size={13}/> : <CircleDot size={13}/>} {progress.m12Mastered ? "Próxima retomada" : "Aula ativa"}</span>
        </div>
        <div className="lesson-row">
          <div className="lesson-index">{activeLesson.index}</div>
          <div className="lesson-main"><strong>{activeLesson.lesson}</strong><p>{activeLesson.checkpoint}</p></div>
          <button className="icon-btn" aria-label={progress.m12Mastered ? "Ver M13 na grade curricular" : "Abrir aula atual"} title={progress.m12Mastered ? "Ver M13 na grade curricular" : "Abrir aula atual"} onClick={() => setView(progress.m12Mastered ? "trilha" : "aula")}><ChevronRight/></button>
        </div>
        <div className="checkpoint"><BrainCircuit size={18}/><span><b>Próximo checkpoint:</b> {activeLesson.next}</span></div>
      </section>

      <section className="milestones panel">
        <div className="section-heading"><div><span className="eyebrow">MARCOS</span><h2>O que já virou conhecimento</h2></div></div>
        <div className="milestone-list">
          <div className="milestone-item"><div className="milestone-icon"><CheckCircle2/></div><div><strong>Switch deixou de ser barreira</strong><p>Casos, ordem e decisão consolidados com exemplos práticos.</p></div></div>
          <div className="milestone-item"><div className="milestone-icon"><CheckCircle2/></div><div><strong>O “clique das caixinhas”</strong><p>Contador, quantidade e soma passaram a ter responsabilidades diferentes.</p></div></div>
          <div className="milestone-item"><div className="milestone-icon"><CheckCircle2/></div><div><strong>Blocos {`{}`} como ações</strong><p>Você passou a ler as chaves como “o que acontece aqui dentro”.</p></div></div>
        </div>
      </section>

      <section className="quick-actions panel">
        <div className="section-heading"><div><span className="eyebrow">ATALHOS</span><h2>Entre direto no trabalho</h2></div></div>
        <div className="quick-grid">
          <button onClick={() => setView("laboratorio")}><Code2/><span><b>Corrigir código</b><small>cole ou carregue um .js</small></span></button>
          <button onClick={() => setView("arena")}><Target/><span><b>Treinar lógica</b><small>desafios gamificados</small></span></button>
          <button onClick={() => setView("conquistas")}><Award/><span><b>Ver conquistas</b><small>marcos e badges</small></span></button>
          <button onClick={() => setView("perfil")}><Radar/><span><b>Analisar evolução</b><small>forças e lacunas</small></span></button>
        </div>
      </section>

      <section className="learning-map panel">
        <div className="section-heading"><div><span className="eyebrow">MAPA DA FORMAÇÃO</span><h2>Onde você está e o que vem depois</h2></div><button className="btn btn-soft" onClick={() => setView("trilha")}>Abrir grade completa <ChevronRight size={16}/></button></div>
        <div className="learning-map-track">
          <article className="map-stage done"><span>M01–M02</span><strong>Fundamentos + decisões</strong><p>Variáveis, operadores, if/else e switch.</p><CheckCircle2/></article>
          <article className="map-stage done"><span>M03–M05</span><strong>Repetição + lógica</strong><p>while, for, contador e acumulador.</p><CheckCircle2/></article>
          <article className={`map-stage ${progress.m07Mastered ? "done" : "current"}`}><span>M06–M07</span><strong>Estrutura + funções</strong><p>{progress.m07Mastered ? "Funções comprovadas em quatro casos de teste." : "Laços aninhados e funções JavaScript em consolidação."}</p>{progress.m07Mastered ? <CheckCircle2/> : <CircleDot/>}</article>
          <article className={`map-stage ${progress.m08Mastered ? "done" : progress.m07Mastered ? "current" : "future"}`}><span>M08</span><strong>Arrays</strong><p>{progress.m08Mastered ? "Índices, percurso, mutação e busca comprovados." : progress.m07Mastered ? "Estruturas de dados em estudo e prática." : "Arrays entram depois que funções estiverem sólidas."}</p>{progress.m08Mastered ? <CheckCircle2/> : progress.m07Mastered ? <CircleDot/> : <LockKeyhole/>}</article>
          <article className={`map-stage ${progress.m09Mastered ? "done" : progress.m08Mastered ? "current" : "future"}`}><span>M09</span><strong>Objetos</strong><p>{progress.m09Mastered ? "Propriedades, métodos e estruturas aninhadas comprovados." : progress.m08Mastered ? "Entidades e pedidos em estudo e prática." : "Objetos entram depois do domínio de Arrays."}</p>{progress.m09Mastered ? <CheckCircle2/> : progress.m08Mastered ? <CircleDot/> : <LockKeyhole/>}</article>
          <article className={`map-stage ${progress.m10Mastered ? "done" : progress.m09Mastered ? "current" : "future"}`}><span>M10</span><strong>Dados primitivos</strong><p>{progress.m10Mastered ? "Textos, números e datas transformados com regras previsíveis." : progress.m09Mastered ? "Strings, Math e Date em estudo e prática." : "Esta etapa entra depois do domínio de Objetos."}</p>{progress.m10Mastered ? <CheckCircle2/> : progress.m09Mastered ? <CircleDot/> : <LockKeyhole/>}</article>
          <article className={`map-stage ${progress.m11Mastered ? "done" : progress.m10Mastered ? "current" : "future"}`}><span>M11</span><strong>Arrays modernos</strong><p>{progress.m11Mastered ? "Seleção, transformação, busca e redução comprovadas." : progress.m10Mastered ? "Callbacks e métodos declarativos em estudo." : "Esta etapa entra depois do domínio de dados primitivos."}</p>{progress.m11Mastered ? <CheckCircle2/> : progress.m10Mastered ? <CircleDot/> : <LockKeyhole/>}</article>
          <article className={`map-stage ${progress.m12Mastered ? "done" : progress.m11Mastered ? "current" : "future"}`}><span>M12</span><strong>JavaScript moderno</strong><p>{progress.m12Mastered ? "Sintaxe moderna aplicada com clareza e segurança." : progress.m11Mastered ? "Arrow, destructuring, spread, rest e acesso seguro em estudo." : "Esta etapa entra depois do domínio de Arrays modernos."}</p>{progress.m12Mastered ? <CheckCircle2/> : progress.m11Mastered ? <CircleDot/> : <LockKeyhole/>}</article>
        </div>
      </section>

      <section className="study-plan panel">
        <div className="section-heading"><div><span className="eyebrow">PLANO DE ESTUDO</span><h2>Como avançar nesta fase</h2></div></div>
        <div className="study-plan-grid">
          <article><span>01</span><div><strong>Compreender</strong><p>Leia a aula atual e acompanhe a história do computador sem tentar decorar JavaScript.</p></div></article>
          <article><span>02</span><div><strong>Reconhecer padrões</strong><p>Estude os 20 exemplos guiados e identifique entrada, processamento, saída e escopo.</p></div></article>
          <article><span>03</span><div><strong>Praticar</strong><p>Somente depois leve os exercícios para o laboratório e passe a construir sem olhar.</p></div></article>
        </div>
      </section>
    </div>
  );
}

function Curriculum() {
  const all = [...completedModules, ...plannedModules];
  const [selected, setSelected] = useState<CourseModule>(completedModules[6]);
  const progress = useCampusProgress();
  useEffect(() => {
    if (!progress.m12Mastered) return;
    const nextModule = all.find(module => module.id === "M13");
    if (nextModule) setSelected(nextModule);
  }, [progress.m12Mastered]);
  const selectedView = getCourseModuleView(selected, progress);
  return (
    <div className="curriculum-layout">
      <section className="panel curriculum-list">
        <div className="section-heading"><div><span className="eyebrow">GRADE CURRICULAR</span><h2>Formação Backend JavaScript</h2></div><span className="credit-tag">22 módulos</span></div>
        <div className="module-scroll">
          {all.map(m => { const view = getCourseModuleView(m, progress); return (
            <button key={m.id} className={`module-row ${selected.id === m.id ? "selected" : ""}`} onClick={() => setSelected(m)}>
              <div className="module-code">{view.id}</div>
              <div className="module-copy"><strong>{view.title}</strong><span>{view.topics.slice(0, 3).join(" · ")}</span></div>
              <div className="module-meta"><StatusPill status={view.status}/><b>{view.progress}%</b></div>
            </button>
          ); })}
        </div>
      </section>
      <aside className="panel module-detail">
        <div className="detail-top"><span className="module-code large">{selectedView.id}</span><StatusPill status={selectedView.status}/></div>
        <h2>{selectedView.title}</h2>
        <p className="detail-note">{selectedView.note ?? "Conteúdo planejado para a próxima etapa da formação."}</p>
        <div className="detail-progress"><div><span>Progresso</span><b>{selectedView.progress}%</b></div><div className="bar"><i style={{ width: `${selectedView.progress}%` }}/></div></div>
        <div className="detail-stats"><div><span>Carga estimada</span><b>{selectedView.hours}</b></div><div><span>XP</span><b>{selectedView.xp}</b></div></div>
        <h3>Conteúdos</h3>
        <div className="topic-list">{selectedView.topics.map(t => <div key={t}><CheckCircle2 size={16}/><span>{t}</span></div>)}</div>
      </aside>
    </div>
  );
}


function Lab() {
  const progress = useCampusProgress();
  const [code, setCode] = useState(starterCode);
  const [fileName, setFileName] = useState("ExercicioAtual.js");
  const [selectedModuleId, setSelectedModuleId] = useState<LabModuleId>("M07");
  const [loadedMissionId, setLoadedMissionId] = useState<MissionId | null>(null);
  const [analysis, setAnalysis] = useState<TeachingAnalysis | null>(null);
  const [analyzedCode, setAnalyzedCode] = useState<string | null>(null);
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [executionContext, setExecutionContext] = useState<{ kind: "free" } | { kind: "mission"; module: MissionId } | null>(null);
  const [running, setRunning] = useState(false);
  const [tutor, setTutor] = useState<TutorResponse | null>(null);
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorError, setTutorError] = useState<string | null>(null);
  const [pedagogicalTrace, setPedagogicalTrace] = useState<ExecutionTrace | null>(null);
  const [preparingTrace, setPreparingTrace] = useState(false);
  const [traceError, setTraceError] = useState<string | null>(null);
  const [workbenchOpen, setWorkbenchOpen] = useState(false);
  const interpreterClient = useMemo(() => createInterpreterWorkerClient(), []);
  const activeInterpretation = useRef<InterpreterWorkerExecution | null>(null);
  const prepareButtonRef = useRef<HTMLButtonElement>(null);
  const executionSequence = useRef(0);
  const tutorAbort = useRef<AbortController | null>(null);
  useEffect(() => () => {
    activeInterpretation.current?.cancel();
    tutorAbort.current?.abort();
    interpreterClient.dispose();
  }, [interpreterClient]);
  const mastered = useMemo<MissionId[]>(() => {
    const values: Array<[MissionId, boolean]> = [
      ["M07", progress.m07Mastered],
      ["M08", progress.m08Mastered],
      ["M09", progress.m09Mastered],
      ["M10", progress.m10Mastered],
      ["M11", progress.m11Mastered],
      ["M12", progress.m12Mastered],
    ];
    return values.filter(([, complete]) => complete).map(([moduleId]) => moduleId);
  }, [progress.m07Mastered, progress.m08Mastered, progress.m09Mastered, progress.m10Mastered, progress.m11Mastered, progress.m12Mastered]);
  const selectedModule = labModules.find(module => module.id === selectedModuleId) ?? labModules[6];
  const executionMissionId = resolveExecutionMission(selectedModuleId, mastered);
  const currentMission = selectedModule.kind === "mission" && executionMissionId
    ? { module: executionMissionId, expectedTests: selectedModule.mission.expectedTests }
    : null;
  const validationMissionId = resolveMissionValidation(selectedModuleId, loadedMissionId);
  const supportsInvestigation = Number(selectedModuleId.slice(1)) <= 7;

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (file.size > MAX_LOCAL_CODE_BYTES) {
      setTraceError(`O arquivo excede o limite local de ${MAX_LOCAL_CODE_BYTES} bytes.`);
      return;
    }
    setRunning(false);
    setCode(await file.text());
    setFileName(file.name);
    setLoadedMissionId(null);
    setAnalysis(null);
    setAnalyzedCode(null);
    setExecution(null);
    setExecutionContext(null);
    executionSequence.current += 1;
    setTutor(null);
    setTutorError(null);
    tutorAbort.current?.abort();
    tutorAbort.current = null;
    setTutorLoading(false);
    activeInterpretation.current?.cancel();
    activeInterpretation.current = null;
    setPreparingTrace(false);
    setPedagogicalTrace(null);
    setTraceError(null);
    setWorkbenchOpen(false);
  };

  const selectModule = (moduleId: LabModuleId) => {
    setRunning(false);
    setSelectedModuleId(moduleId);
    setLoadedMissionId(null);
    setAnalysis(null);
    setAnalyzedCode(null);
    setExecution(null);
    setExecutionContext(null);
    executionSequence.current += 1;
    setTutor(null);
    setTutorError(null);
    tutorAbort.current?.abort();
    tutorAbort.current = null;
    setTutorLoading(false);
    activeInterpretation.current?.cancel();
    activeInterpretation.current = null;
    setPreparingTrace(false);
    setPedagogicalTrace(null);
    setTraceError(null);
    setWorkbenchOpen(false);
  };

  const loadSelectedMission = () => {
    if (selectedModule.kind !== "mission" || !currentMission) return;
    setRunning(false);
    setCode(selectedModule.mission.code);
    setFileName(selectedModule.mission.fileName);
    setLoadedMissionId(currentMission.module);
    setAnalysis(null);
    setAnalyzedCode(null);
    setExecution(null);
    setExecutionContext(null);
    executionSequence.current += 1;
    setTutor(null);
    setTutorError(null);
    tutorAbort.current?.abort();
    tutorAbort.current = null;
    setTutorLoading(false);
    activeInterpretation.current?.cancel();
    activeInterpretation.current = null;
    setPreparingTrace(false);
    setPedagogicalTrace(null);
    setTraceError(null);
    setWorkbenchOpen(false);
  };

  const analyzeCode = async () => {
    const nextAnalysis = analyzeJavaScript(code, selectedModuleId);
    setAnalysis(nextAnalysis);
    setAnalyzedCode(code);
    setTutor(null);
    setTutorError(null);
    setTraceError(null);

    if (!supportsInvestigation) {
      setPedagogicalTrace(null);
      return;
    }

    activeInterpretation.current?.cancel();
    setPreparingTrace(true);
    const execution = interpreterClient.run(code);
    activeInterpretation.current = execution;
    try {
      const trace = await execution.result;
      if (activeInterpretation.current?.requestId !== execution.requestId) return;
      setPedagogicalTrace(trace);
      setWorkbenchOpen(true);
    } catch (error) {
      if (activeInterpretation.current?.requestId !== execution.requestId) return;
      setTraceError(error instanceof Error ? error.message : "Não foi possível preparar a execução passo a passo.");
    } finally {
      if (activeInterpretation.current?.requestId === execution.requestId) {
        activeInterpretation.current = null;
        setPreparingTrace(false);
      }
    }
  };

  const requestTutor = async () => {
    if (!analysis || analyzedCode !== code) {
      setTutorError("Atualize a análise local antes de pedir uma explicação ao Tutor.");
      return;
    }
    if (code.length > 12_000) {
      setTutorError("O Tutor aceita códigos de até 12.000 caracteres. A análise local continua disponível.");
      return;
    }

    tutorAbort.current?.abort();
    const controller = new AbortController();
    tutorAbort.current = controller;
    setTutorLoading(true);
    setTutorError(null);
    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(buildTutorRequest(analysis, code, execution)),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error("O Tutor não conseguiu validar esta solicitação.");
      const parsed = tutorResponseSchema.safeParse(body);
      if (!parsed.success) throw new Error("O Tutor devolveu uma resposta fora do formato seguro.");
      if (!controller.signal.aborted) setTutor(parsed.data);
    } catch (error) {
      if (!controller.signal.aborted) setTutorError(error instanceof Error ? error.message : "Não foi possível abrir o Tutor agora.");
    } finally {
      if (tutorAbort.current === controller) {
        tutorAbort.current = null;
        setTutorLoading(false);
      }
    }
  };

  const executeCode = async (missionId: MissionId | null) => {
    const sequence = ++executionSequence.current;
    setRunning(true);
    setExecution(null);
    setExecutionContext(missionId ? { kind: "mission", module: missionId } : { kind: "free" });
    try {
      const result = await runJavaScriptLocally(code, missionId);
      if (executionSequence.current !== sequence) return;
      setExecution(result);
      if (missionId && currentMission?.module === missionId) {
        const passed = result.tests.length === currentMission.expectedTests && result.tests.every(test => test.ok);
        try {
          const savedAttempts = JSON.parse(localStorage.getItem("campus-lab-attempts") ?? "[]");
          const attempts = Array.isArray(savedAttempts) ? savedAttempts : [];
          attempts.push({ module: missionId, fileName, passed, passedTests: result.tests.filter(test => test.ok).length, totalTests: currentMission.expectedTests, createdAt: new Date().toISOString() });
          localStorage.setItem("campus-lab-attempts", JSON.stringify(attempts.slice(-50)));

          if (passed) {
            const mastered = readMasteredModules();
            if (!mastered.includes(missionId)) localStorage.setItem("campus-module-mastery", JSON.stringify([...mastered, missionId]));
          }
          window.dispatchEvent(new Event("campus-progress-changed"));
        } catch {}
      }
    } catch {
      if (executionSequence.current === sequence) {
        setExecution({ logs: [], tests: [], error: "Não foi possível concluir a execução local." });
      }
    } finally {
      if (executionSequence.current === sequence) setRunning(false);
    }
  };
  const missionPassed = Boolean(
    currentMission
    && executionContext?.kind === "mission"
    && executionContext.module === currentMission.module
    && execution?.tests.length === currentMission.expectedTests
    && execution.tests.every(test => test.ok),
  );
  const nextModule = currentMission && currentMission.module !== "M12"
    ? `M${String(Number(currentMission.module.slice(1)) + 1).padStart(2, "0")}`
    : "M13";

  if (workbenchOpen && pedagogicalTrace) {
    return <ExecutionWorkbench trace={pedagogicalTrace} code={code} moduleId={selectedModuleId} onExit={() => {
      setWorkbenchOpen(false);
      window.setTimeout(() => prepareButtonRef.current?.focus(), 0);
    }}/>;
  }

  return (
    <div className="lab-layout">
      <section className="panel editor-panel">
        <div className="editor-toolbar"><div><span className="dot red"/><span className="dot amber"/><span className="dot green"/><b title={fileName}>{fileName}</b></div><label className="btn btn-soft"><Upload size={16}/> Carregar .js<input hidden type="file" accept=".js,.mjs,.txt" onChange={e => handleFile(e.target.files?.[0])}/></label></div>
        <div className="editor-wrap"><Editor height="100%" defaultLanguage="javascript" value={code} onChange={v => { setRunning(false); setCode(v ?? ""); setExecution(null); setExecutionContext(null); setPedagogicalTrace(null); setTraceError(null); executionSequence.current += 1; tutorAbort.current?.abort(); tutorAbort.current = null; setTutorLoading(false); activeInterpretation.current?.cancel(); activeInterpretation.current = null; setPreparingTrace(false); }} theme="vs-dark" options={{ accessibilitySupport: "on", ariaLabel: "Editor JavaScript do laboratório", minimap: { enabled: false }, fontSize: 16, lineHeight: 25, roundedSelection: false, padding: { top: 18 }, wordWrap: "on" }}/></div>
      </section>
      <aside className="panel review-panel">
        <div className="section-heading"><div><span className="eyebrow">LABORATÓRIO JAVASCRIPT</span><h2>Contexto do estudo</h2></div><ShieldCheck/></div>
        <p className="review-intro">Escolha o módulo antes de analisar ou executar. O arquivo carregado permanece no contexto selecionado; o nome do arquivo nunca decide a suíte de testes.</p>
        <LabModulePicker selectedModuleId={selectedModuleId} mastered={mastered} onSelect={selectModule}/>
        <div className="selected-lab-context">
          <div><span>CONTEXTO ATIVO</span><strong>{selectedModule.id} · {selectedModule.title}</strong></div>
          <p>{selectedModule.concepts.join(" · ")}</p>
          {selectedModule.kind === "mission" && currentMission && <button className="btn btn-soft" type="button" onClick={loadSelectedMission}><Target size={16}/>{validationMissionId ? `Recarregar missão ${selectedModule.id}` : `Carregar missão ${selectedModule.id}`}</button>}
          {validationMissionId && <span className="mission-loaded"><CheckCircle2 size={14}/>Missão {validationMissionId} carregada e pronta para validação</span>}
        </div>
        <div className="lab-action-grid">
          <button ref={prepareButtonRef} className="btn btn-primary" disabled={preparingTrace} onClick={analyzeCode}><BrainCircuit size={16}/> {preparingTrace ? "Preparando investigação..." : supportsInvestigation ? "Investigar meu código" : "Analisar estrutura"}</button>
          <button className="btn btn-run" disabled={running} onClick={() => executeCode(null)}><Play size={16}/> {running && executionContext?.kind === "free" ? "Executando..." : "Executar normalmente"}</button>
          {validationMissionId && <button className="btn btn-validate" disabled={running} onClick={() => executeCode(validationMissionId)}><Target size={16}/> {running && executionContext?.kind === "mission" ? "Validando..." : `Validar missão ${validationMissionId}`}</button>}
        </div>
        <div className="lab-action-help"><span><b>Investigar:</b> abre a Bancada passo a passo.</span><span><b>Executar:</b> mostra somente o console.</span>{validationMissionId && <span><b>Validar:</b> aplica os testes oficiais da missão.</span>}</div>
        {traceError && <div className="execution-error" role="alert"><XCircle size={16}/><span>{traceError}</span></div>}
        {execution && <div className="execution-result">
          <div className="execution-heading"><span className="eyebrow">{executionContext?.kind === "mission" ? `VALIDAÇÃO ${executionContext.module}` : "EXECUÇÃO LIVRE"}</span><strong>{execution.timedOut ? "Tempo excedido" : execution.error ? "Execução com erro" : executionContext?.kind === "mission" && currentMission ? `${execution.tests.filter(test => test.ok).length}/${currentMission.expectedTests} critérios atendidos` : "Código executado"}</strong></div>
          {execution.error && <div className="execution-error"><XCircle size={16}/><span>{execution.error}</span></div>}
          {execution.tests.length > 0 && <div className="execution-tests">{execution.tests.map(test => <div key={test.name} className={test.ok ? "pass" : "fail"}>{test.ok ? <CheckCircle2/> : <XCircle/>}<span><b>{test.name}</b><small>Esperado: {test.expected} · Recebido: {test.received}</small></span></div>)}</div>}
          <div className="console-output"><span>CONSOLE</span>{execution.logs.length ? execution.logs.map((line, index) => <code key={`${line}-${index}`}>{line}</code>) : <code>Nenhuma saída com console.log.</code>}</div>
        </div>}
        {missionPassed && currentMission && <div className="mastery-earned"><CheckCircle2 size={20}/><div><span>DOMÍNIO {currentMission.module} COMPROVADO</span><strong>{currentMission.module === "M12" ? "JavaScript moderno concluído. O próximo ponto de retomada é M13 · Módulos e organização." : `${selectedModule.title} concluído. O módulo ${nextModule} foi liberado.`}</strong></div></div>}
        <AnimatePresence mode="wait">
          {analysis ? <motion.div key="result" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="analysis-ready"><BrainCircuit/><div><strong>{pedagogicalTrace && !traceError ? "Investigação disponível" : "Análise estrutural concluída"}</strong><span>{analysis.flow.length} etapas estruturais · {analysis.variables.length} variáveis · {analysis.functions.length} funções</span></div></motion.div> : execution ? null : <div className="empty-review"><FileCode2/><strong>Escolha como trabalhar com o código</strong><span>Investigue o fluxo, execute livremente ou carregue a missão para validar o domínio.</span></div>}
        </AnimatePresence>
      </aside>
      {analysis && Number(selectedModuleId.slice(1)) > 7 && <TeachingBoard analysis={analysis} fileName={fileName} stale={analyzedCode !== code} onRequestTutor={requestTutor} tutor={tutor} tutorLoading={tutorLoading} tutorError={tutorError}/>}
    </div>
  );
}

function Achievements() {
  const progress = useCampusProgress();
  const badges: { title: string; description: string; icon: React.ComponentType<{ size?: number }>; earned: boolean }[] = [
    { title: "Base lógica", description: "Decisões, laços e responsabilidades das variáveis consolidados.", icon: BrainCircuit, earned: true },
    { title: "Caixinhas", description: "Contador, quantidade e soma separados mentalmente.", icon: LibraryBig, earned: true },
    { title: "Funções I", description: "Parâmetros, composição e retorno comprovados em 4/4 testes.", icon: Code2, earned: progress.m07Mastered },
    { title: "Coleções", description: "Índices, percurso, busca e mutação comprovados em 6/6 testes.", icon: BookMarked, earned: progress.m08Mastered },
    { title: "Modelo de domínio", description: "Objetos e estruturas aninhadas comprovados em 6/6 testes.", icon: Target, earned: progress.m09Mastered },
    { title: "Dado confiável", description: "Strings, números e datas tratados com previsibilidade.", icon: ShieldCheck, earned: progress.m10Mastered },
    { title: "Coleções modernas", description: "filter, map, find, every e reduce comprovados em 8/8 testes.", icon: Sparkles, earned: progress.m11Mastered },
    { title: "Sintaxe moderna", description: "Arrow, destructuring, spread, rest e acesso seguro comprovados.", icon: Award, earned: progress.m12Mastered },
    { title: "Arena completa", description: "Os seis desafios de leitura de funções foram resolvidos.", icon: Trophy, earned: progress.challenges === 6 },
    { title: "Revisor constante", description: "Doze itens do acervo foram revisitados nesta rodada.", icon: RotateCcw, earned: progress.reviews >= 12 },
  ];
  const earned = badges.filter(badge => badge.earned).length;
  return <div className="achievements-view"><section className="panel achievement-hero"><div><span className="eyebrow">CONQUISTAS · {earned}/{badges.length}</span><h1>Marcos que registram compreensão, não só presença.</h1></div><div className="trophy-mark"><Trophy/></div></section><section className="badge-grid">{badges.map(badge => { const Icon = badge.icon; return <article className={`panel badge-card ${badge.earned ? "" : "muted-card"}`} key={badge.title}><div className="badge-emoji"><Icon size={28}/></div><h3>{badge.title}</h3><p>{badge.description}</p><span>{badge.earned ? "Conquistado" : "Bloqueado"}</span></article>; })}</section></div>;
}

function Performance() {
  const progress = useCampusProgress();
  const skills = [
    ["Estruturas de decisão", 92], ["Laços de repetição", 88], ["Contador e acumulador", 94], ["Leitura de execução", 86], ["Laços aninhados", 72], ["Funções", progress.m07Mastered ? 100 : 64], ["Arrays", progress.m08Mastered ? 100 : progress.m07Mastered ? 72 : 0], ["Objetos", progress.m09Mastered ? 100 : progress.m08Mastered ? 72 : 0], ["Strings, Math e Date", progress.m10Mastered ? 100 : progress.m09Mastered ? 72 : 0], ["Arrays modernos", progress.m11Mastered ? 100 : progress.m10Mastered ? 72 : 0], ["JavaScript moderno", progress.m12Mastered ? 100 : progress.m11Mastered ? 72 : 0]
  ] as const;
  return <div className="performance-layout"><section className="panel performance-main"><div className="section-heading"><div><span className="eyebrow">DESEMPENHO</span><h2>Mapa de domínio</h2></div><Radar/></div><div className="skill-bars">{skills.map(([s,v])=><div className="skill" key={s}><div><span>{s}</span><b>{v}%</b></div><div className="bar"><i style={{width:`${v}%`}}/></div></div>)}</div></section><aside className="panel focus-panel"><span className="eyebrow">FOCO ATUAL</span><h2>Profundidade antes de velocidade.</h2><p>O padrão de aprendizagem que mais funcionou foi: visualizar a lógica, entender as “caixinhas”, acompanhar a execução e só então escrever JavaScript.</p><div className="focus-note"><BrainCircuit/><span>{progress.m12Mastered ? "JavaScript moderno comprovado em oito testes. Pausa registrada; próxima retomada no M13." : progress.m11Mastered ? "Arrays modernos comprovados em oito testes. Prioridade: concluir JavaScript moderno." : progress.m10Mastered ? "Dados primitivos comprovados. Prioridade: concluir a missão final de Arrays modernos." : progress.m09Mastered ? "Objetos comprovados. Prioridade: concluir a missão final de Strings, Math e Date." : progress.m08Mastered ? "Arrays comprovados. Prioridade: concluir a missão final de Objetos." : progress.m07Mastered ? "Funções comprovadas. Prioridade: concluir a missão final de Arrays." : "Prioridade: passar nos quatro testes da missão final de Funções."}</span></div></aside></div>;
}

export default function CampusApp() {
  const [view, setView] = useState<View>("dashboard");
  const progress = useCampusProgress();
  const content = useMemo(() => {
    switch (view) {
      case "dashboard": return <Dashboard setView={setView}/>;
      case "trilha": return <Curriculum/>;
      case "aula": return <Classroom/>;
      case "laboratorio": return <Lab/>;
      case "arena": return <PracticeArena/>;
      case "conquistas": return <Achievements/>;
      case "perfil": return <Performance/>;
    }
  }, [view]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">JS</div><div><strong>Campus Backend</strong><span>Curso aberto de JavaScript Backend</span></div></div>
        <nav aria-label="Navegação principal">{nav.map(item => { const Icon = item.icon; return <button key={item.id} aria-label={item.label} title={item.label} className={view===item.id?"active":""} onClick={()=>setView(item.id)}><Icon size={19} strokeWidth={1.9}/><span>{item.label}</span>{item.id==="aula"&&<i/>}</button>})}</nav>
        <div className="sidebar-card"><Flame/><div><span>Foco desta etapa</span><strong>{progress.m12Mastered ? "M13 · Módulos ES" : progress.m11Mastered ? "M12 · JavaScript moderno" : progress.m10Mastered ? "M11 · Arrays modernos" : progress.m09Mastered ? "M10 · Strings" : progress.m08Mastered ? "M09 · Objetos" : progress.m07Mastered ? "M08 · Arrays" : "M07 · Funções"}</strong></div></div>
        <div className="sidebar-footer"><div className="avatar">CP</div><div><strong>Carlos Pereira</strong><span>Fundamentos II</span></div></div>
      </aside>
      <section className="workspace">
        <header className="topbar"><div><span className="crumb">FORMAÇÃO / BACKEND JAVASCRIPT</span></div><div className="top-actions"><span className="semester">{progress.m12Mastered ? "M13 · Próxima retomada" : progress.m11Mastered ? "M12 · JavaScript moderno liberado" : progress.m10Mastered ? "M11 · Arrays modernos liberado" : progress.m09Mastered ? "M10 · Strings liberado" : progress.m08Mastered ? "M09 · Objetos liberado" : progress.m07Mastered ? "M08 · Arrays liberado" : "M07 · Funções"}</span><div className="xp-pill"><Sparkles size={15}/> Progresso local</div><div className="avatar small">CP</div></div></header>
        <div className="content-wrap"><AnimatePresence mode="wait"><motion.div key={view} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:.18}} className="view-root">{content}</motion.div></AnimatePresence></div>
      </section>
    </main>
  );
}
