import type { SkillPickerProps } from '@/features/diagnostic/types';
import { cn } from '@/lib/utils';

/**
 * Left-hand list letting the patient pick which AI Assistant skill drives the conversation
 * (`GET /ai-assistant/skills` for the options, `skill` field of `POST
 * /ai-assistant/send-message` for the selection). No confirmed Figma frame for this control
 * yet — kept to existing selection/list tokens (`bg-primary`, `list-background-hover`)
 * rather than inventing new ones, so it can be reconciled against a real design later.
 */
function SkillPicker({
  skills,
  selectedSkillId,
  onSelect,
  isLoading = false,
  className,
}: SkillPickerProps) {
  return (
    <nav
      aria-label="Compétences de l'assistant"
      className={cn('flex w-full flex-col gap-1', className)}
    >
      {isLoading && <p className="text-body-secondary px-3 py-2 text-sm">Chargement…</p>}

      {!isLoading && skills.length === 0 && (
        <p className="text-body-secondary px-3 py-2 text-sm">Aucune compétence disponible.</p>
      )}

      {skills.map(skill => {
        const isSelected = skill.id === selectedSkillId;
        return (
          <button
            key={skill.id}
            type="button"
            onClick={() => onSelect(skill.id)}
            aria-pressed={isSelected}
            className={cn(
              'w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'text-body-primary hover:bg-list-background-hover'
            )}
          >
            {skill.label}
          </button>
        );
      })}
    </nav>
  );
}

export { SkillPicker };
