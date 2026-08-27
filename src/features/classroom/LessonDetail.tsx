"use client";

import {
  AlertTriangle,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Lightbulb,
  Route,
  Target,
  ArrowRight,
} from "lucide-react";
import type { CourseItem, CourseLibraryModule } from "@/course/courseLibrary";
import { getLessonContent } from "@/course/lessonContent";
import FunctionFlow from "@/features/classroom/labs/FunctionFlow";
import CodeViewer from "./CodeViewer";
import ArrayFlow from "@/features/classroom/labs/ArrayFlow";
import ArrayMutationLab from "@/features/classroom/labs/ArrayMutationLab";
import ArrayLoopLab from "@/features/classroom/labs/ArrayLoopLab";
import ArraySearchLab from "@/features/classroom/labs/ArraySearchLab";
import ObjectExplorer from "@/features/classroom/labs/ObjectExplorer";
import ObjectPropertyLab from "@/features/classroom/labs/ObjectPropertyLab";
import ObjectMethodLab from "@/features/classroom/labs/ObjectMethodLab";
import NestedObjectMap from "@/features/classroom/labs/NestedObjectMap";
import StringWorkshop from "@/features/classroom/labs/StringWorkshop";
import TemplateReceipt from "@/features/classroom/labs/TemplateReceipt";
import MathRoundingLab from "@/features/classroom/labs/MathRoundingLab";
import DateTimeline from "@/features/classroom/labs/DateTimeline";
import CallbackLoopLab from "@/features/classroom/labs/CallbackLoopLab";
import MapTransformationLab from "@/features/classroom/labs/MapTransformationLab";
import FilterGateLab from "@/features/classroom/labs/FilterGateLab";
import ArrayQuestionLab from "@/features/classroom/labs/ArrayQuestionLab";
import ReduceAccumulatorLab from "@/features/classroom/labs/ReduceAccumulatorLab";
import ArrowFunctionBridge from "@/features/classroom/labs/ArrowFunctionBridge";
import DestructuringLab from "@/features/classroom/labs/DestructuringLab";
import SpreadCloneLab from "@/features/classroom/labs/SpreadCloneLab";
import FlexibleParametersLab from "@/features/classroom/labs/FlexibleParametersLab";
import OptionalChainLab from "@/features/classroom/labs/OptionalChainLab";
import type { LessonProgressRecord, LessonStep } from "@/progress/catalog";

type Props = {
  module: CourseLibraryModule;
  item: CourseItem;
  context?: "current" | "review" | "next";
  lessonNumber?: string;
  progress?: LessonProgressRecord;
  savingProgress?: boolean;
  progressError?: string;
  onMarkStep?: (step: LessonStep) => Promise<boolean>;
};

export default function LessonDetail({ module, item, context = "review", lessonNumber, progress, savingProgress = false, progressError, onMarkStep }: Props) {
  const detail = getLessonContent(module, item);
  const isCurrent = context === "current";
  const contextLabel = isCurrent ? "AULA ATUAL" : context === "next" ? "PRÓXIMO MÓDULO" : "REVISÃO GUIADA";

  return (
    <div className="lesson-detail-shell">
      <div className="lecture-header">
        <div>
          <span className="eyebrow">{module.id} · {module.title.toUpperCase()} · {contextLabel}</span>
          <h1>{item.title}</h1>
          <p>{item.summary}</p>
        </div>
        <div className="lesson-number">{lessonNumber ?? item.id}</div>
      </div>

      <div className="lesson-intro-grid">
        <article className="lesson-goal-card"><Target/><div><span>OBJETIVO DA AULA</span><strong>{detail.objective}</strong></div></article>
        <article className="lesson-prereq-card"><BookOpenCheck/><div><span>VOCÊ JÁ SABE</span><strong>{detail.prereq}</strong></div></article>
      </div>

      <div className="story-card">
        <div className="story-title"><BrainCircuit/> Veja o programa inteiro como uma história</div>
        <div className="flow-story flow-story-horizontal flow-story-library">
          {detail.story.map((step, index) => (
            <div className="flow-story-piece" key={`${item.id}-story-${index}`}>
              <div className={`flow-node ${index === 0 || index === detail.story.length - 1 ? "start" : ""}`}>{step}</div>
              {index < detail.story.length - 1 && <div className="flow-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="lesson-explanation">
        <div className="lesson-explanation-title"><Route/><div><span className="eyebrow">PASSO A PASSO</span><h2>O que realmente acontece no computador</h2></div></div>
        {detail.steps.map((step, index) => (
          <article key={`${item.id}-step-${index}`} className="lesson-explanation-step">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><h3>{step.title}</h3><p>{step.body}</p></div>
          </article>
        ))}
      </div>

      <div className="concept-grid concept-grid-expanded">
        {detail.cards.map((card, index) => (
          <article key={`${item.id}-card-${index}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>

      <div className="lesson-code-block">
        <div className="code-caption"><Code2 size={17}/><span>{detail.codeLabel}</span><em>{item.kind === "aula" ? "reconstrua a lógica antes da sintaxe" : "compare com o raciocínio do exercício"}</em></div>
        <CodeViewer code={detail.code} ariaLabel={`Código de ${item.title}`} />
      </div>

      {item.id === "M07-A07" && <FunctionFlow />}
      {item.id === "M08-A01" && <ArrayFlow />}
      {item.id === "M08-A02" && <ArrayMutationLab />}
      {item.id === "M08-A03" && <ArrayLoopLab />}
      {item.id === "M08-A04" && <ArraySearchLab />}
      {item.id === "M09-A01" && <ObjectExplorer />}
      {item.id === "M09-A02" && <ObjectPropertyLab />}
      {item.id === "M09-A03" && <ObjectMethodLab />}
      {item.id === "M09-A04" && <NestedObjectMap />}
      {item.id === "M10-A01" && <StringWorkshop />}
      {item.id === "M10-A02" && <TemplateReceipt />}
      {item.id === "M10-A03" && <MathRoundingLab />}
      {item.id === "M10-A04" && <DateTimeline />}
      {item.id === "M11-A01" && <CallbackLoopLab />}
      {item.id === "M11-A02" && <MapTransformationLab />}
      {item.id === "M11-A03" && <FilterGateLab />}
      {item.id === "M11-A04" && <ArrayQuestionLab />}
      {item.id === "M11-A05" && <ReduceAccumulatorLab />}
      {item.id === "M12-A01" && <ArrowFunctionBridge />}
      {item.id === "M12-A02" && <DestructuringLab />}
      {item.id === "M12-A03" && <SpreadCloneLab />}
      {item.id === "M12-A04" && <FlexibleParametersLab />}
      {item.id === "M12-A05" && <OptionalChainLab />}

      {item.note && <div className="lesson-history-note"><CheckCircle2/><div><strong>Nota do histórico</strong><p>{item.note}</p></div></div>}

      <div className="lesson-bottom-grid">
        <article className="lesson-note good"><Lightbulb/><div><strong>Como ler mentalmente</strong><p>{detail.mental}</p></div></article>
        <article className="lesson-note warning"><AlertTriangle/><div><strong>Não confunda</strong><p>{detail.warning}</p></div></article>
      </div>

      {item.kind === "aula" && onMarkStep && <section className="lesson-completion panel">
        <div className="lesson-completion-heading">
          <div><span className="eyebrow">PROGRESSÃO DA AULA</span><h2>Conclua tudo antes de avançar</h2><p>Cada confirmação é salva na sua conta.</p></div>
          <strong>{[progress?.explanationDone, progress?.boardDone, progress?.checkpointDone, progress?.exerciseDone].filter(Boolean).length}/4</strong>
        </div>
        <div className="lesson-requirements">
          {([
            ["explanation", "Explicação estudada", "Li o passo a passo e consigo contar a ideia com minhas palavras."],
            ["board", "Lousa acompanhada", "Acompanhei a história, o código e o fluxo apresentado nesta aula."],
            ["checkpoint", "Checkpoint respondido", "Conferi mentalmente entradas, processamento e saída."],
            ["exercise", "Prática realizada", "Refiz o exemplo ou exercício proposto antes de seguir."],
          ] as const).map(([step, title, description]) => {
            const done = progress?.[`${step}Done` as keyof LessonProgressRecord] === true;
            return <button key={step} type="button" className={done ? "done" : ""} disabled={done || savingProgress} onClick={() => onMarkStep(step)}><CheckCircle2/><span><strong>{title}</strong><small>{description}</small></span></button>;
          })}
        </div>
        {progressError && <p className="lesson-progress-error" role="alert">{progressError}</p>}
        <button className="btn btn-primary lesson-complete-button" type="button" disabled={savingProgress || !progress?.explanationDone || !progress.boardDone || !progress.checkpointDone || !progress.exerciseDone || progress.completed} onClick={() => onMarkStep("complete")}>
          {progress?.completed ? "Aula concluída" : savingProgress ? "Salvando…" : "Concluir aula e avançar"}<ArrowRight size={17}/>
        </button>
      </section>}
    </div>
  );
}
