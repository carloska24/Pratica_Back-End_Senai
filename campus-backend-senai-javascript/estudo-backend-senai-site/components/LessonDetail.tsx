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
} from "lucide-react";
import type { CourseItem, CourseLibraryModule } from "@/lib/courseLibrary";
import { getLessonContent } from "@/lib/lessonContent";
import FunctionFlow from "@/components/FunctionFlow";
import CodeViewer from "@/components/CodeViewer";
import ArrayFlow from "@/components/ArrayFlow";
import ArrayMutationLab from "@/components/ArrayMutationLab";
import ArrayLoopLab from "@/components/ArrayLoopLab";
import ArraySearchLab from "@/components/ArraySearchLab";
import ObjectExplorer from "@/components/ObjectExplorer";
import ObjectPropertyLab from "@/components/ObjectPropertyLab";
import ObjectMethodLab from "@/components/ObjectMethodLab";
import NestedObjectMap from "@/components/NestedObjectMap";
import StringWorkshop from "@/components/StringWorkshop";
import TemplateReceipt from "@/components/TemplateReceipt";
import MathRoundingLab from "@/components/MathRoundingLab";
import DateTimeline from "@/components/DateTimeline";
import CallbackLoopLab from "@/components/CallbackLoopLab";
import MapTransformationLab from "@/components/MapTransformationLab";
import FilterGateLab from "@/components/FilterGateLab";
import ArrayQuestionLab from "@/components/ArrayQuestionLab";
import ReduceAccumulatorLab from "@/components/ReduceAccumulatorLab";
import ArrowFunctionBridge from "@/components/ArrowFunctionBridge";
import DestructuringLab from "@/components/DestructuringLab";
import SpreadCloneLab from "@/components/SpreadCloneLab";
import FlexibleParametersLab from "@/components/FlexibleParametersLab";
import OptionalChainLab from "@/components/OptionalChainLab";

type Props = {
  module: CourseLibraryModule;
  item: CourseItem;
  context?: "current" | "review" | "next";
  lessonNumber?: string;
};

export default function LessonDetail({ module, item, context = "review", lessonNumber }: Props) {
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
    </div>
  );
}
