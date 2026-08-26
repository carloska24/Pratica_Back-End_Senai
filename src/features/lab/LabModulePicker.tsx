import { BookOpen, LockKeyhole, Target } from "lucide-react";
import type { LabModuleId, MissionId } from "../../runner/contracts";
import { isLabModuleAvailable, labModules } from "../../runner/missionCatalog";

type LabModulePickerProps = {
  selectedModuleId: LabModuleId;
  mastered: readonly MissionId[];
  onSelect: (moduleId: LabModuleId) => void;
};

export function LabModulePicker({ selectedModuleId, mastered, onSelect }: LabModulePickerProps) {
  return (
    <div className="lab-module-picker" aria-label="Escolha o contexto do laboratório">
      {labModules.map(module => {
        const available = isLabModuleAvailable(module.id, mastered);
        const previousModule = `M${String(Number(module.id.slice(1)) - 1).padStart(2, "0")}`;
        const detail = module.kind === "review"
          ? "Revisão livre"
          : available
            ? `${module.mission.expectedTests} casos de teste`
            : `Conclua ${previousModule}`;

        return (
          <button
            aria-label={`${module.id} · ${module.title} · ${detail}`}
            aria-pressed={selectedModuleId === module.id}
            className={`lab-module-option${selectedModuleId === module.id ? " active" : ""}`}
            disabled={!available}
            key={module.id}
            onClick={() => onSelect(module.id)}
            type="button"
          >
            <span className="lab-module-icon" aria-hidden="true">
              {!available ? <LockKeyhole /> : module.kind === "review" ? <BookOpen /> : <Target />}
            </span>
            <span><b>{module.id}</b><strong>{module.title}</strong><small>{detail}</small></span>
          </button>
        );
      })}
    </div>
  );
}
