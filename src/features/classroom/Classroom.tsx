"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookMarked,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  Code2,
  LibraryBig,
  Lightbulb,
  LockKeyhole,
  RotateCcw,
  Route,
  Sparkles,
  Target,
} from "lucide-react";
import { functionExamples } from "@/course/functionExamples";
import { courseLibrary, type CourseLibraryModule } from "@/course/courseLibrary";
import LessonDetail from "./LessonDetail";
import CodeViewer from "./CodeViewer";
import { readMasteredModules, readUniqueIntegers, readUniqueStrings } from "@/progress/storage";
import { useStudentProgress } from "@/progress/useStudentProgress";
import { isLessonUnlocked, modulePercentage } from "@/progress/catalog";

const courseItemIds = new Set(courseLibrary.flatMap(module => module.items.map(item => item.id)));
const LAST_LESSON_KEY = "campus-last-lesson";

export default function Classroom() {
  const [mode, setMode] = useState<"aula" | "exemplos" | "biblioteca">("aula");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [studied, setStudied] = useState<number[]>([]);
  const [libraryStudied, setLibraryStudied] = useState<string[]>([]);
  const [moduleIndex, setModuleIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [activeLessonModuleIndex, setActiveLessonModuleIndex] = useState(0);
  const [activeLessonItemIndex, setActiveLessonItemIndex] = useState(0);
  const [m07Mastered, setM07Mastered] = useState(false);
  const [m08Mastered, setM08Mastered] = useState(false);
  const [m09Mastered, setM09Mastered] = useState(false);
  const [m10Mastered, setM10Mastered] = useState(false);
  const [m11Mastered, setM11Mastered] = useState(false);
  const [m12Mastered, setM12Mastered] = useState(false);
  const studentJourney = useStudentProgress();

  useEffect(() => {
    try {
      const savedExamples = readUniqueIntegers("campus-function-examples", 1, functionExamples.length);
      const savedLibrary = readUniqueStrings("campus-course-library", courseItemIds);
      const mastered = readMasteredModules();
      const hasM07 = mastered.includes("M07");
      const hasM08 = mastered.includes("M08");
      const hasM09 = mastered.includes("M09");
      const hasM10 = mastered.includes("M10");
      const hasM11 = mastered.includes("M11");
      const hasM12 = mastered.includes("M12");
      setStudied(savedExamples);
      setLibraryStudied(savedLibrary);
      localStorage.setItem("campus-function-examples", JSON.stringify(savedExamples));
      localStorage.setItem("campus-course-library", JSON.stringify(savedLibrary));
      localStorage.setItem("campus-module-mastery", JSON.stringify(mastered));
      setM07Mastered(hasM07);
      setM08Mastered(hasM08);
      setM09Mastered(hasM09);
      setM10Mastered(hasM10);
      setM11Mastered(hasM11);
      setM12Mastered(hasM12);
      const recommendedModule = hasM11 || hasM12 ? 11 : hasM10 ? 10 : hasM09 ? 9 : hasM08 ? 8 : hasM07 ? 7 : 0;
      let lessonModule = recommendedModule;
      let lessonItem = 0;
      try {
        const lastLesson = JSON.parse(localStorage.getItem(LAST_LESSON_KEY) ?? "null");
        const savedModuleIndex = courseLibrary.findIndex(module => module.id === lastLesson?.moduleId);
        const savedItemIndex = savedModuleIndex >= 0 ? courseLibrary[savedModuleIndex].items.findIndex(item => item.id === lastLesson?.itemId) : -1;
        const moduleId = courseLibrary[savedModuleIndex]?.id;
        const unlocked = savedModuleIndex >= 0 && (savedModuleIndex <= 6 || moduleId === "M08" && hasM07 || moduleId === "M09" && hasM08 || moduleId === "M10" && hasM09 || moduleId === "M11" && hasM10 || moduleId === "M12" && hasM11);
        if (unlocked && savedItemIndex >= 0) {
          lessonModule = savedModuleIndex;
          lessonItem = savedItemIndex;
        }
      } catch {}
      setModuleIndex(lessonModule);
      setItemIndex(lessonItem);
      setActiveLessonModuleIndex(lessonModule);
      setActiveLessonItemIndex(lessonItem);
    } catch {}
    const refreshMastery = () => {
      try {
        const mastered = readMasteredModules();
        setM07Mastered(mastered.includes("M07"));
        setM08Mastered(mastered.includes("M08"));
        setM09Mastered(mastered.includes("M09"));
        setM10Mastered(mastered.includes("M10"));
        setM11Mastered(mastered.includes("M11"));
        setM12Mastered(mastered.includes("M12"));
      } catch {}
    };
    window.addEventListener("campus-progress-changed", refreshMastery);
    window.addEventListener("storage", refreshMastery);
    return () => {
      window.removeEventListener("campus-progress-changed", refreshMastery);
      window.removeEventListener("storage", refreshMastery);
    };
  }, []);

  useEffect(() => {
    if (studentJourney.loading) return;
    const nextModuleIndex = courseLibrary.findIndex(module => module.items.some(item => item.id === studentJourney.currentLessonId));
    if (nextModuleIndex < 0) return;
    const nextItemIndex = courseLibrary[nextModuleIndex].items.findIndex(item => item.id === studentJourney.currentLessonId);
    if (nextItemIndex < 0) return;
    setModuleIndex(nextModuleIndex);
    setItemIndex(nextItemIndex);
    setActiveLessonModuleIndex(nextModuleIndex);
    setActiveLessonItemIndex(nextItemIndex);
  }, [studentJourney.currentLessonId, studentJourney.loading]);

  const publishProgressChange = () => {
    window.dispatchEvent(new Event("campus-progress-changed"));
  };

  const toggleStudied = (id: number) => {
    const next = studied.includes(id) ? studied.filter(x => x !== id) : [...studied, id];
    setStudied(next);
    localStorage.setItem("campus-function-examples", JSON.stringify(next));
    publishProgressChange();
  };

  const toggleLibraryStudied = (id: string) => {
    const next = libraryStudied.includes(id) ? libraryStudied.filter(x => x !== id) : [...libraryStudied, id];
    setLibraryStudied(next);
    localStorage.setItem("campus-course-library", JSON.stringify(next));
    publishProgressChange();
  };

  const resetModule = (moduleId: string) => {
    const ids = courseLibrary.find(m => m.id === moduleId)?.items.map(i => i.id) ?? [];
    const next = libraryStudied.filter(id => !ids.includes(id));
    setLibraryStudied(next);
    localStorage.setItem("campus-course-library", JSON.stringify(next));
    publishProgressChange();
    setItemIndex(0);
  };

  const resetAllLibrary = () => {
    setLibraryStudied([]);
    localStorage.setItem("campus-course-library", JSON.stringify([]));
    publishProgressChange();
  };

  const example = functionExamples[exampleIndex];
  const selectedModule = courseLibrary[moduleIndex];
  const selectedItem = selectedModule.items[Math.min(itemIndex, selectedModule.items.length - 1)];
  const moduleDone = selectedModule.items.filter(item => libraryStudied.includes(item.id)).length;
  const activeLessonModule = courseLibrary[activeLessonModuleIndex] ?? courseLibrary[0];
  const activeLessonItem = activeLessonModule.items[activeLessonItemIndex] ?? activeLessonModule.items[0];
  const isModuleMastered = (moduleId: string) => moduleId === "M07" ? m07Mastered : moduleId === "M08" ? m08Mastered : moduleId === "M09" ? m09Mastered : moduleId === "M10" ? m10Mastered : moduleId === "M11" ? m11Mastered : moduleId === "M12" ? m12Mastered : false;
  const isModuleUnlocked = (index: number) => index === 0 || modulePercentage(courseLibrary[index - 1].id, studentJourney.records) === 100;

  const chooseModule = (index: number) => {
    if (!isModuleUnlocked(index)) return;
    setModuleIndex(index);
    setItemIndex(0);
  };

  const setActiveLesson = (moduleIdx: number, itemIdx: number) => {
    const module = courseLibrary[moduleIdx];
    const item = module.items[itemIdx];
    if (item.kind === "aula" && !isLessonUnlocked(item.id, studentJourney.records)) return;
    setActiveLessonModuleIndex(moduleIdx);
    setActiveLessonItemIndex(itemIdx);
    localStorage.setItem(LAST_LESSON_KEY, JSON.stringify({ moduleId: module.id, itemId: item.id }));
  };

  const chooseLibraryItem = (index: number) => {
    setItemIndex(index);
    if (selectedModule.items[index]?.kind === "aula") {
      setActiveLesson(moduleIndex, index);
    }
  };

  const openSelectedAsLesson = (moduleIdx = moduleIndex, preferredItemIdx?: number) => {
    const module = courseLibrary[moduleIdx];
    if (!isModuleUnlocked(moduleIdx)) return;
    const lessonIndexes = module.items.map((item, index) => item.kind === "aula" ? index : -1).filter(index => index >= 0);
    const currentLessonIndex = module.items.findIndex(item => item.id === studentJourney.currentLessonId);
    const defaultLessonIndex = currentLessonIndex >= 0 ? currentLessonIndex : (lessonIndexes[0] ?? 0);
    const openedItemIndex = preferredItemIdx ?? defaultLessonIndex;
    setActiveLesson(moduleIdx, openedItemIndex);
    setMode("aula");
  };

  const moduleStatusLabel = (module: CourseLibraryModule) => {
    if (module.id === "M08" && !m07Mastered) return "BLOQUEADO · CONCLUA M07";
    if (module.id === "M09" && !m08Mastered) return "BLOQUEADO · CONCLUA M08";
    if (module.id === "M10" && !m09Mastered) return "BLOQUEADO · CONCLUA M09";
    if (module.id === "M11" && !m10Mastered) return "BLOQUEADO · CONCLUA M10";
    if (module.id === "M12" && !m11Mastered) return "BLOQUEADO · CONCLUA M11";
    if (module.id === "M07" && m07Mastered) return "MÓDULO CONCLUÍDO · TESTES 4/4";
    if (module.id === "M08" && m08Mastered) return "MÓDULO CONCLUÍDO · TESTES 6/6";
    if (module.id === "M09" && m09Mastered) return "MÓDULO CONCLUÍDO · TESTES 6/6";
    if (module.id === "M10" && m10Mastered) return "MÓDULO CONCLUÍDO · TESTES 6/6";
    if (module.id === "M11" && m11Mastered) return "MÓDULO CONCLUÍDO · TESTES 8/8";
    if (module.id === "M12" && m12Mastered) return "MÓDULO CONCLUÍDO · TESTES 8/8";
    if (module.status === "concluido") return "MÓDULO CONCLUÍDO";
    if (module.status === "disponivel") return "PRÓXIMO MÓDULO · DISPONÍVEL";
    return "MÓDULO EM ANDAMENTO";
  };

  return (
    <div className="classroom-layout">
      <section className="panel lecture">
        <div className="classroom-tabs">
          <button className={mode === "aula" ? "active" : ""} onClick={() => setMode("aula")}>Aula atual</button>
          <button className={mode === "biblioteca" ? "active" : ""} onClick={() => setMode("biblioteca")}><BookMarked size={16}/> Curso estudado <span>{libraryStudied.length}</span></button>
          <button className={mode === "exemplos" ? "active" : ""} onClick={() => setMode("exemplos")}>20 exemplos guiados <span>{studied.length}/20</span></button>
        </div>

        {mode === "aula" ? <>
          <LessonDetail module={activeLessonModule} item={activeLessonItem} context="current" lessonNumber={activeLessonItem.title.split("·")[0]?.trim() || activeLessonItem.id} progress={studentJourney.records.find(record => record.lessonId === activeLessonItem.id)} savingProgress={studentJourney.saving} progressError={studentJourney.error} onMarkStep={step => studentJourney.markStep(activeLessonItem.id, step)} />
        </> : mode === "biblioteca" ? <>
          <div className="library-header">
            <div><span className="eyebrow">ACERVO DO CURSO · REVISÃO LIVRE</span><h1>Seu histórico de estudo continua acessível.</h1><p>Abra qualquer módulo, reveja a explicação, consulte o código comentado em JavaScript e marque uma nova rodada de revisão sem apagar seu progresso.</p></div>
            <button className="btn btn-soft" onClick={resetAllLibrary}><RotateCcw size={16}/> Limpar revisões</button>
          </div>

          <div className="library-module-tabs">
            {courseLibrary.map((module, i) => {
              const done = module.items.filter(item => libraryStudied.includes(item.id)).length;
              const locked = !isModuleUnlocked(i);
              const mastered = modulePercentage(module.id, studentJourney.records) === 100;
              const available = !locked && !mastered;
              const prerequisite = i > 0 ? courseLibrary[i - 1].id : "início";
              const score = module.id === "M07" ? "4/4" : module.id === "M08" || module.id === "M09" || module.id === "M10" ? "6/6" : "8/8";
              return <button key={module.id} disabled={locked} className={`${i === moduleIndex ? "active" : ""} ${available ? "available" : ""} ${locked ? "locked" : ""}`} onClick={() => chooseModule(i)}><span>{module.id}</span><strong>{module.title}</strong><small>{locked ? `Conclua a missão ${prerequisite}` : mastered ? `Domínio comprovado · ${score}` : `${available ? "Próximo · " : ""}${done}/${module.items.length} revisados`}</small>{locked && <LockKeyhole size={16}/>}</button>;
            })}
          </div>

          <div className="library-toolbar">
            <div><span className="eyebrow">{selectedModule.id} · {moduleStatusLabel(selectedModule)}</span><h2>{selectedModule.title}</h2><p>{selectedModule.items.length} itens catalogados · {moduleDone} revisados nesta rodada.</p></div>
            <div className="library-toolbar-actions"><button className="btn btn-primary" onClick={() => openSelectedAsLesson(moduleIndex, selectedItem.kind === "aula" ? itemIndex : undefined)}><BookOpenCheck size={16}/> {isModuleMastered(selectedModule.id) ? "Revisar aula-chave" : selectedModule.status === "disponivel" ? "Abrir primeira aula" : "Aula atual do módulo"}</button><button className="btn btn-soft" onClick={() => resetModule(selectedModule.id)}><RotateCcw size={16}/> Reestudar módulo</button></div>
          </div>

          <div className="library-course-navigator">
            {selectedModule.items.map((item, i) => <button key={item.id} className={`${i === itemIndex ? "active" : ""} ${libraryStudied.includes(item.id) ? "done" : ""}`} onClick={() => chooseLibraryItem(i)}>
              <span className={`kind kind-${item.kind}`}>{item.kind}</span>
              <strong>{item.title}</strong>
              <small>{item.summary}</small>
              {libraryStudied.includes(item.id) && <CheckCircle2 size={17}/>} 
            </button>)}
          </div>

          <div className="library-detail-frame">
            <LessonDetail module={selectedModule} item={selectedItem} context={(selectedModule.id === "M08" && m08Mastered) || (selectedModule.id === "M09" && m09Mastered) || (selectedModule.id === "M10" && m10Mastered) || (selectedModule.id === "M11" && m11Mastered) || (selectedModule.id === "M12" && m12Mastered) ? "review" : selectedModule.status === "disponivel" ? "next" : "review"} lessonNumber={selectedItem.id} />
            {selectedItem.note && <div className="library-note"><Sparkles size={18}/><p>{selectedItem.note}</p></div>}
            <div className="library-review-checklist">
              <span className="eyebrow">CHECKLIST DE REVISÃO</span>
              <p><CheckCircle2/> Consigo explicar a ideia sem decorar a sintaxe.</p>
              <p><CheckCircle2/> Consigo identificar o papel de cada variável, condição ou repetição.</p>
              <p><CheckCircle2/> Consigo prever o fluxo antes de executar.</p>
            </div>
            <div className="library-reader-actions">
              <button className={`btn ${libraryStudied.includes(selectedItem.id) ? "btn-soft" : "btn-primary"}`} onClick={() => toggleLibraryStudied(selectedItem.id)}>{libraryStudied.includes(selectedItem.id) ? <><RotateCcw size={16}/> Marcar para reestudar</> : <><CheckCircle2 size={16}/> Marcar revisão concluída</>}</button>
              <button className="btn btn-soft" onClick={() => openSelectedAsLesson(moduleIndex, itemIndex)}><BookOpenCheck size={16}/> Abrir em modo aula</button>
            </div>
          </div>
        </> : <>
          <div className="guided-header">
            <div><span className="eyebrow">BIBLIOTECA GUIADA · FUNÇÕES JAVASCRIPT</span><h1>Exemplo {String(example.id).padStart(2, "0")} · {example.title}</h1><p>{example.concept}</p></div>
            <div className="example-progress"><strong>{studied.length}</strong><span>de 20 estudados</span></div>
          </div>

          <div className="example-navigator">
            {functionExamples.map((item, i) => <button aria-label={`Abrir exemplo ${item.id}`} key={item.id} className={`${i === exampleIndex ? "active" : ""} ${studied.includes(item.id) ? "done" : ""}`} onClick={() => setExampleIndex(i)}>{String(item.id).padStart(2,"0")}</button>)}
          </div>

          <div className="example-learning-header">
            <article><Target/><div><span>OBJETIVO</span><strong>{example.objective}</strong></div></article>
            <article><Lightbulb/><div><span>POR QUE ISSO IMPORTA</span><strong>{example.whyItMatters}</strong></div></article>
          </div>

          <div className="example-analogy"><BrainCircuit/><div><span className="eyebrow">IMAGEM MENTAL</span><p>{example.analogy}</p></div></div>

          <div className="example-contract">
            <div><span>ENTRADA</span><strong>{example.input}</strong></div><div className="contract-arrow"><ArrowRight size={18}/></div>
            <div><span>PROCESSAMENTO</span><strong>{example.process}</strong></div><div className="contract-arrow"><ArrowRight size={18}/></div>
            <div><span>SAÍDA</span><strong>{example.output}</strong></div>
          </div>

          <div className="example-workspace">
            <article className="story-sequence"><div className="story-title dark"><Route/> Programa inteiro como uma história</div>{example.story.map((step, i) => <div className="story-step" key={`${example.id}-${i}`}><span>{i+1}</span><p>{step}</p>{i < example.story.length-1 && <b>↓</b>}</div>)}</article>
            <article className="example-code"><div className="code-caption"><Code2 size={16}/><span>JavaScript · referência comentada</span><em>{example.difficulty} · +{example.xp} XP</em></div><CodeViewer code={example.code} ariaLabel={`Código do exemplo ${example.id}: ${example.title}`} maxHeight={440}/></article>
          </div>

          <div className="example-trace">
            <div className="trace-title"><BrainCircuit/><div><span className="eyebrow">RASTREAMENTO DAS CAIXINHAS</span><h3>Veja os valores andando pelo programa</h3></div></div>
            <div className="trace-grid">{example.trace.map(item => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong><p>{item.note}</p></article>)}</div>
          </div>

          <div className="example-study-grid">
            <article className="example-focus-card"><span className="eyebrow">O QUE OBSERVAR</span>{example.focus.map(item => <p key={item}><CheckCircle2 size={16}/>{item}</p>)}</article>
            <article className="example-pitfall-card"><span className="eyebrow">ERROS QUE CONFUNDEM</span>{example.pitfalls.map(item => <p key={item}><AlertTriangle size={16}/>{item}</p>)}</article>
          </div>

          <div className="example-checkpoint"><Target/><div><span>CHECKPOINT MENTAL</span><strong>{example.checkpoint}</strong></div></div>

          <div className="example-focus-actions"><button className={`btn ${studied.includes(example.id) ? "btn-soft" : "btn-primary"}`} onClick={() => toggleStudied(example.id)}>{studied.includes(example.id) ? <><RotateCcw size={16}/> Marcar para reestudar</> : <><Award size={16}/> Marcar como estudado</>}</button></div>
          <div className="example-footer-nav"><button className="btn btn-soft" disabled={exampleIndex === 0} onClick={() => setExampleIndex(i => Math.max(0, i-1))}>← Anterior</button><span>{exampleIndex + 1} de {functionExamples.length}</span><button className="btn btn-primary" disabled={exampleIndex === functionExamples.length - 1} onClick={() => setExampleIndex(i => Math.min(functionExamples.length-1, i+1))}>Próximo →</button></div>
        </>}
      </section>

      <aside className="panel lesson-sidebar">
        <div className="mentor-card"><div className="mentor-avatar">CX</div><div><span>Professor do preparatório</span><strong>Codex · visual → lógica → JavaScript</strong></div></div>
        <h3>{mode === "aula" ? "Mapa da aula" : mode === "biblioteca" ? "Revisão permanente" : "Plano dos 20 exemplos de funções"}</h3>
        {mode === "aula" ? <>
          <div className="lesson-checks">{activeLessonItem.concepts.slice(0,4).map(concept => <div key={concept}><CheckCircle2/><span>{concept}</span></div>)}</div>
          <div className="sidebar-study-path"><span>MÓDULO</span><strong>{activeLessonModule.id} · {activeLessonModule.title}</strong><i/><span>AGORA</span><strong>{activeLessonItem.title}</strong><i/><span>STATUS</span><strong>{(activeLessonModule.id === "M07" && m07Mastered) || (activeLessonModule.id === "M08" && m08Mastered) || (activeLessonModule.id === "M09" && m09Mastered) || (activeLessonModule.id === "M10" && m10Mastered) || (activeLessonModule.id === "M11" && m11Mastered) || (activeLessonModule.id === "M12" && m12Mastered) ? "Domínio comprovado no Laboratório" : activeLessonModule.status === "concluido" ? "Revisão de conteúdo concluído" : activeLessonModule.status === "disponivel" ? "Próximo conteúdo disponível" : "Conteúdo em andamento"}</strong></div>
        </> : mode === "biblioteca" ? <div className="library-side"><LibraryBig/><p>Conteúdo concluído não desaparece. Use este acervo como uma biblioteca acadêmica: aula para reconstruir conceito, exercício para lembrar aplicação e desafio para testar autonomia.</p><div><strong>{courseLibrary.length}</strong><span>módulos disponíveis</span></div><div><strong>{courseLibrary.reduce((sum,m) => sum + m.items.length,0)}</strong><span>itens catalogados</span></div></div> : <div className="guided-stats"><div><span>Base</span><strong>8 exemplos</strong></div><div><span>Intermediário</span><strong>7 exemplos</strong></div><div><span>Integração</span><strong>5 exemplos</strong></div><div><span>Progresso</span><strong>{Math.round(studied.length / 20 * 100)}%</strong></div></div>}
        <div className="study-rule"><Sparkles/><p><b>Regra desta fase:</b> compreender primeiro, praticar depois. O conteúdo permanece disponível e qualquer marcação pode ser limpa para uma nova rodada de estudo.</p></div>
      </aside>
    </div>
  );
}
