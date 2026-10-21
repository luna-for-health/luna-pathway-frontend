import { Button, Loader } from '@/components/ui';
import type { PatientDocumentRowProps } from '@/features/patient-questionnaire/types';
import { ExternalLinkIcon, TrashIcon } from '@/icons';

/**
 * "step 3 / uploaded" document-list row (Figma node 6767:3898's "document line" /
 * "uploading-document line" variants, node 6771:3260 for the errored-upload card reuses the
 * same finished-row shape). Row height is content-sized (48px via py-2 + 20px line text),
 * divider reuses `--color-button-neutral-bg` (#e0e2eb) — same hex as Figma's `neutral/10`
 * token, so no separate token was added for it.
 *
 * The delete button uses `variant="destructive"` (pink `--color-button-danger-bg` pill,
 * dark-red `--color-button-danger-text` icon) — Figma's "uploaded" node (6767:3881) renders
 * it visibly distinct from the neutral "view" button beside it, not the same grey pill.
 * `TrashIcon` was switched to `fill="currentColor"` for this to actually recolor.
 */
function DocumentRow(props: PatientDocumentRowProps) {
  if (props.status === 'uploading') {
    return (
      <div className="border-button-neutral-bg flex w-full items-center gap-2 border-b py-2 pr-4 pl-6">
        <Loader variant="spokes" className="size-6 shrink-0" />
        <p className="text-body-primary shrink-0 text-sm leading-5 font-medium whitespace-nowrap">
          {props.name}
        </p>
        <p className="text-body-tertiary flex-1 text-right text-xs leading-4 font-medium">
          Envoi en cours...
        </p>
      </div>
    );
  }

  return (
    <div className="border-button-neutral-bg flex w-full items-center gap-2 border-b py-2 pr-2 pl-6">
      <p className="text-body-primary min-w-0 flex-1 truncate text-sm leading-5 font-medium">
        {props.name}
      </p>
      <div className="flex shrink-0 items-start gap-2">
        <Button
          type="button"
          variant="neutral"
          size="icon-pill"
          onClick={props.onView}
          aria-label="Voir le document"
        >
          <ExternalLinkIcon className="size-5" />
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="icon-pill"
          onClick={props.onDelete}
          aria-label="Supprimer"
        >
          <TrashIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}

export { DocumentRow };
