"use client";

import { useEffect, useMemo, useState } from "react";
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
import { courseLibrary } from "@/course/courseLibrary";
import { useCampusProgress, type CampusProgress } from "@/progress/useCampusProgress";
import { getCourseModuleView } from "@/progress/courseProgress";
import { readMasteredModules } from "@/progress/storage";
import { evaluateJavaScript } from "@/runner/analyzer";
import { runJavaScriptLocally } from "@/runner/browserRunner";
import type { ExecutionResult, MissionId } from "@/runner/contracts";
import {
  arrayMissionCode,
  arrayMissionFile,
  dataMissionCode,
  dataMissionFile,
  functionMissionCode,
  functionMissionFile,
  modernArrayMissionCode,
  modernArrayMissionFile,
  modernJavaScriptMissionCode,
  modernJavaScriptMissionFile,
  objectMissionCode,
  objectMissionFile,
  starterCode,
} from "@/runner/missionCatalog";

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
  const [analysis, setAnalysis] = useState<ReturnType<typeof evaluateJavaScript> | null>(null);
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [running, setRunning] = useState(false);
  const handleFile = async (file?: File) => {
    if (!file) return;
    setCode(await file.text());
    setFileName(file.name);
    setAnalysis(null);
    setExecution(null);
  };
  const loadMission = (missionCode: string, missionFile: string) => {
    setCode(missionCode);
    setFileName(missionFile);
    setAnalysis(null);
    setExecution(null);
  };
  const currentMission = fileName === functionMissionFile
    ? { module: "M07" as MissionId, expectedTests: 4 }
    : fileName === arrayMissionFile
      ? { module: "M08" as MissionId, expectedTests: 6 }
      : fileName === objectMissionFile
        ? { module: "M09" as MissionId, expectedTests: 6 }
        : fileName === dataMissionFile
          ? { module: "M10" as MissionId, expectedTests: 6 }
          : fileName === modernArrayMissionFile
            ? { module: "M11" as MissionId, expectedTests: 8 }
            : fileName === modernJavaScriptMissionFile
              ? { module: "M12" as MissionId, expectedTests: 8 }
              : null;
  const executeCode = async () => {
    setRunning(true);
    setExecution(null);
    const result = await runJavaScriptLocally(code, currentMission?.module ?? null);
    setExecution(result);
    if (currentMission) {
      const passed = result.tests.length === currentMission.expectedTests && result.tests.every(test => test.ok);
      try {
        const savedAttempts = JSON.parse(localStorage.getItem("campus-lab-attempts") ?? "[]");
        const attempts = Array.isArray(savedAttempts) ? savedAttempts : [];
        attempts.push({ module: currentMission.module, fileName, passed, passedTests: result.tests.filter(test => test.ok).length, totalTests: result.tests.length, createdAt: new Date().toISOString() });
        localStorage.setItem("campus-lab-attempts", JSON.stringify(attempts.slice(-50)));

        if (passed) {
          const mastered = readMasteredModules();
          if (!mastered.includes(currentMission.module)) localStorage.setItem("campus-module-mastery", JSON.stringify([...mastered, currentMission.module]));
        }
        window.dispatchEvent(new Event("campus-progress-changed"));
      } catch {}
    }
    setRunning(false);
  };
  const missionPassed = Boolean(currentMission && execution?.tests.length === currentMission.expectedTests && execution.tests.every(test => test.ok));
  return (
    <div className="lab-layout">
      <section className="panel editor-panel">
        <div className="editor-toolbar"><div><span className="dot red"/><span className="dot amber"/><span className="dot green"/><b title={fileName}>{fileName}</b></div><label className="btn btn-soft"><Upload size={16}/> Carregar .js<input hidden type="file" accept=".js,.mjs,.txt" onChange={e => handleFile(e.target.files?.[0])}/></label></div>
        <div className="editor-wrap"><Editor height="100%" defaultLanguage="javascript" value={code} onChange={v => setCode(v ?? "")} theme="vs-dark" options={{ minimap: { enabled: false }, fontSize: 16, lineHeight: 25, roundedSelection: false, padding: { top: 18 }, wordWrap: "on" }}/></div>
      </section>
      <aside className="panel review-panel">
        <div className="section-heading"><div><span className="eyebrow">LABORATÓRIO JAVASCRIPT</span><h2>Revisão estrutural</h2></div><ShieldCheck/></div>
        <p className="review-intro">Analise a estrutura ou execute o código localmente em um Worker isolado do navegador. Cada missão final possui casos de teste próprios e limite automático de tempo.</p>
        <div className="mission-picker" aria-label="Missões finais disponíveis">
          <button className={`btn mission-loader ${fileName === functionMissionFile ? "active" : ""}`} onClick={() => loadMission(functionMissionCode, functionMissionFile)}><Target size={16}/><span><b>M07 · Funções</b><small>4 casos de teste</small></span></button>
          <button className={`btn mission-loader ${fileName === arrayMissionFile ? "active" : ""}`} disabled={!progress.m07Mastered} onClick={() => loadMission(arrayMissionCode, arrayMissionFile)}>{progress.m07Mastered ? <Target size={16}/> : <LockKeyhole size={16}/>}<span><b>M08 · Arrays</b><small>{progress.m07Mastered ? "6 casos de teste" : "conclua M07"}</small></span></button>
          <button className={`btn mission-loader ${fileName === objectMissionFile ? "active" : ""}`} disabled={!progress.m08Mastered} onClick={() => loadMission(objectMissionCode, objectMissionFile)}>{progress.m08Mastered ? <Target size={16}/> : <LockKeyhole size={16}/>}<span><b>M09 · Objetos</b><small>{progress.m08Mastered ? "6 casos de teste" : "conclua M08"}</small></span></button>
          <button className={`btn mission-loader ${fileName === dataMissionFile ? "active" : ""}`} disabled={!progress.m09Mastered} onClick={() => loadMission(dataMissionCode, dataMissionFile)}>{progress.m09Mastered ? <Target size={16}/> : <LockKeyhole size={16}/>}<span><b>M10 · Dados</b><small>{progress.m09Mastered ? "6 casos de teste" : "conclua M09"}</small></span></button>
          <button className={`btn mission-loader ${fileName === modernArrayMissionFile ? "active" : ""}`} disabled={!progress.m10Mastered} onClick={() => loadMission(modernArrayMissionCode, modernArrayMissionFile)}>{progress.m10Mastered ? <Target size={16}/> : <LockKeyhole size={16}/>}<span><b>M11 · Arrays modernos</b><small>{progress.m10Mastered ? "8 casos de teste" : "conclua M10"}</small></span></button>
          <button className={`btn mission-loader ${fileName === modernJavaScriptMissionFile ? "active" : ""}`} disabled={!progress.m11Mastered} onClick={() => loadMission(modernJavaScriptMissionCode, modernJavaScriptMissionFile)}>{progress.m11Mastered ? <Target size={16}/> : <LockKeyhole size={16}/>}<span><b>M12 · JavaScript moderno</b><small>{progress.m11Mastered ? "8 casos de teste" : "conclua M11"}</small></span></button>
        </div>
        <div className="lab-action-grid"><button className="btn btn-primary" onClick={() => setAnalysis(evaluateJavaScript(code))}><ShieldCheck size={16}/> Analisar estrutura</button><button className="btn btn-run" disabled={running} onClick={executeCode}><Play size={16}/> {running ? "Executando..." : "Executar código"}</button></div>
        {execution && <div className="execution-result">
          <div className="execution-heading"><span className="eyebrow">EXECUÇÃO LOCAL</span><strong>{execution.timedOut ? "Tempo excedido" : execution.error ? "Execução com erro" : execution.tests.length ? `${execution.tests.filter(test => test.ok).length}/${execution.tests.length} testes passaram` : "Código executado"}</strong></div>
          {execution.error && <div className="execution-error"><XCircle size={16}/><span>{execution.error}</span></div>}
          {execution.tests.length > 0 && <div className="execution-tests">{execution.tests.map(test => <div key={test.name} className={test.ok ? "pass" : "fail"}>{test.ok ? <CheckCircle2/> : <XCircle/>}<span><b>{test.name}</b><small>Esperado: {test.expected} · Recebido: {test.received}</small></span></div>)}</div>}
          <div className="console-output"><span>CONSOLE</span>{execution.logs.length ? execution.logs.map((line, index) => <code key={`${line}-${index}`}>{line}</code>) : <code>Nenhuma saída com console.log.</code>}</div>
        </div>}
        {missionPassed && currentMission && <div className="mastery-earned"><CheckCircle2 size={20}/><div><span>DOMÍNIO {currentMission.module} COMPROVADO</span><strong>{currentMission.module === "M07" ? "Funções concluídas. O módulo M08 · Arrays foi liberado na Sala de Aula." : currentMission.module === "M08" ? "Arrays concluídos. Você está pronto para iniciar M09 · Objetos JavaScript." : currentMission.module === "M09" ? "Objetos concluídos. A próxima etapa da formação é M10 · Strings, Math e Date." : currentMission.module === "M10" ? "Strings, Math e Date concluídos. A próxima etapa é M11 · Arrays modernos." : currentMission.module === "M11" ? "Arrays modernos concluídos. A próxima etapa é M12 · JavaScript moderno." : "JavaScript moderno concluído. O próximo ponto de retomada é M13 · Módulos e organização."}</strong></div></div>}
        <AnimatePresence mode="wait">
          {analysis ? <motion.div key="result" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="analysis-result">
            <div className="score-box"><span>Score estrutural</span><strong>{analysis.score}</strong><small>/ 100</small></div>
            <div className="analysis-checks">{analysis.checks.map(c => <div key={c.label} className={c.ok ? "pass" : "fail"}>{c.ok ? <CheckCircle2/> : <XCircle/>}<span>{c.label}</span></div>)}</div>
            <div className="review-note"><BrainCircuit/><p><b>Próxima camada:</b> runner Node.js isolado, casos de teste, captura de console, comparação de resultado e feedback pedagógico por missão.</p></div>
          </motion.div> : execution ? null : <div className="empty-review"><FileCode2/><strong>Seu feedback aparecerá aqui</strong><span>Carregue um ExercicioXX.js ou use o exemplo atual.</span></div>}
        </AnimatePresence>
      </aside>
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
