import { useEffect, useRef, useState } from 'react';
import type * as React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Alert, Button, Dialog } from '@/components/ui';
import { DocumentRow } from '@/features/diagnostic/components/document-row';
import { usePreRdvScreenView } from '@/features/diagnostic/hooks';
import { getOrCreateQuestionnaireId } from '@/features/diagnostic/lib/analytics';
import {
  getDiagnosticDraft,
  saveDiagnosticDraft,
} from '@/features/diagnostic/lib/diagnostic-draft';
import type { PatientDocument } from '@/features/diagnostic/lib/documents';
import { getFileExtension, validateDocumentFile } from '@/features/diagnostic/lib/documents';
import type { DiagnosticDraftState, PatientDocumentsProps } from '@/features/diagnostic/types';
import { ArrowBackIcon, ArrowForwardIcon, FileIcon, MoonIcon } from '@/icons';
import { now } from '@/lib/time';
import { cn } from '@/lib/utils';
import { AnalyticsEvent, analytics } from '@/services';

/**
 * "step 3" (Figma node 6762:3226 "step 3 / upload", plus its "uploaded"/"in progress" states
 * — node 6767:3881 — and "errored" state — node 6771:3246, and the delete-confirm dialog —
 * node 6773:4146) — document upload, routed at `/diagnostic/step-6` and labeled "Étape 4/4" —
 * it's sub-step B of the last step, not a separate top-level step. Sub-step A is the
 * recent-imaging question at `/diagnostic/step-5` — see `PatientImaging`.
 *
 * No confirmed per-file upload endpoint exists for this step itself (the old
 * `/diagnostic/documents` feature's endpoint was removed along with it — see project memory),
 * so a file "uploads" locally: it's added with `status: 'uploading'`, then flipped to
 * `'uploaded'` after a short delay, mirroring the same placeholder-timeout pattern used for
 * step 2's loader state. The real `File` objects (not just their names) are threaded forward
 * to `RequestSummary` via `DiagnosticDraftState.documents`, which does submit them for real —
 * as part of the single `POST /consultation-requests` multipart call on step 6's "Valider et
 * envoyer", not from this step.
 */
/**
 * `crypto.randomUUID()` only exists in a secure context (HTTPS, or `localhost`) — on a phone
 * hitting this app over plain `http://<lan-ip>` during local testing it's `undefined`, so
 * calling it threw and silently aborted `addFiles` before `setDocuments` ever ran, making
 * uploaded documents never appear on mobile. Falls back to a non-crypto id in that case; still
 * prefers the real UUID when available.
 */
function generateDocumentId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function PatientDocuments({ onDeleteDialogOpenChange }: PatientDocumentsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DiagnosticDraftState | null;
  const questionnaireId = getOrCreateQuestionnaireId(state?.questionnaireId);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restored as already uploaded — a file still "uploading" when the patient left the step
  // finished its (simulated) upload anyway.
  const [documents, setDocuments] = useState<PatientDocument[]>(
    () =>
      getDiagnosticDraft(questionnaireId).documents?.map(document => ({
        ...document,
        status: 'uploaded' as const,
      })) ??
      state?.documents?.map(file => ({
        id: generateDocumentId(),
        file,
        status: 'uploaded' as const,
      })) ??
      []
  );
  const [error, setError] = useState<string>();
  const [deleteTargetId, setDeleteTargetId] = useState<string>();
  const enteredAtRef = useRef(now());
  // Set right before `handleDeleteConfirm`'s own `setDeleteTargetId(undefined)`, so the
  // `Dialog`'s `onOpenChange(false)` call that immediately follows a confirm (see
  // `components/ui/dialog.tsx`'s `handleConfirm` — it calls `onConfirm` then always
  // `onOpenChange(false)`, on both confirm AND cancel) can tell the two apart and fire only
  // one `DELETE_DOCUMENT` event per dialog interaction, not two.
  const confirmedDeleteRef = useRef(false);

  usePreRdvScreenView({
    screenId: 'documents',
    stepNumber: 6,
    screenType: 'upload',
    questionnaireId,
    hasIncomingState: Boolean(state),
  });

  useEffect(() => {
    onDeleteDialogOpenChange?.(deleteTargetId !== undefined);
  }, [deleteTargetId, onDeleteDialogOpenChange]);

  // Kept in the draft so the files are still listed when the patient comes back to this step.
  useEffect(() => {
    saveDiagnosticDraft(questionnaireId, { documents });
  }, [questionnaireId, documents]);

  const hasUploadedDocument = documents.some(document => document.status === 'uploaded');
  const nextLabel = hasUploadedDocument ? 'Suivant' : 'Passer';

  function addFiles(fileList: FileList | null, source: 'browse' | 'drag_drop') {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    analytics.track(AnalyticsEvent.StartDocumentUpload, {
      source,
      file_count: files.length,
      questionnaire_id: questionnaireId,
    });

    let firstError: ReturnType<typeof validateDocumentFile>;
    const validFiles: File[] = [];
    const failedFiles: File[] = [];

    files.forEach(file => {
      const validationError = validateDocumentFile(file);
      if (validationError) {
        firstError = firstError ?? validationError;
        failedFiles.push(file);
        return;
      }
      validFiles.push(file);

      const id = generateDocumentId();
      setDocuments(previous => [...previous, { id, file, status: 'uploading' }]);

      window.setTimeout(() => {
        setDocuments(previous =>
          previous.map(document =>
            document.id === id ? { ...document, status: 'uploaded' } : document
          )
        );
      }, 800);
    });

    setError(firstError?.message);

    if (firstError && failedFiles.length > 0) {
      analytics.track(AnalyticsEvent.CompleteDocumentUpload, {
        status: 'failed',
        error_type: firstError.type,
        file_count: failedFiles.length,
        total_size_kb: Math.round(failedFiles.reduce((sum, file) => sum + file.size, 0) / 1024),
        file_types: Array.from(new Set(failedFiles.map(file => getFileExtension(file.name)))),
        duration_sec: 0,
        questionnaire_id: questionnaireId,
      });
    }

    if (validFiles.length > 0) {
      const totalSizeKb = Math.round(validFiles.reduce((sum, file) => sum + file.size, 0) / 1024);
      const fileTypes = Array.from(new Set(validFiles.map(file => getFileExtension(file.name))));
      // Mirrors the fixed 800ms simulated-upload delay above — see `generateDocumentId`'s doc
      // comment: no real per-file upload endpoint exists yet, so this is a placeholder
      // duration, not a measured one.
      window.setTimeout(() => {
        analytics.track(AnalyticsEvent.CompleteDocumentUpload, {
          status: 'success',
          file_count: validFiles.length,
          total_size_kb: totalSizeKb,
          file_types: fileTypes,
          duration_sec: 0.8,
          questionnaire_id: questionnaireId,
        });
      }, 800);
    }
  }

  function handleDropzoneClick() {
    inputRef.current?.click();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    addFiles(event.target.files, 'browse');
    event.target.value = '';
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    addFiles(event.dataTransfer.files, 'drag_drop');
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleView(document: PatientDocument) {
    analytics.track(AnalyticsEvent.ViewDocument, {
      file_type: getFileExtension(document.file.name),
      questionnaire_id: questionnaireId,
    });
    window.open(URL.createObjectURL(document.file), '_blank', 'noopener,noreferrer');
  }

  function handleDeleteConfirm() {
    if (!deleteTargetId) return;
    confirmedDeleteRef.current = true;
    analytics.track(AnalyticsEvent.DeleteDocument, {
      action: 'confirmed',
      documents_remaining_count: documents.filter(document => document.id !== deleteTargetId)
        .length,
      questionnaire_id: questionnaireId,
    });
    setDocuments(previous => previous.filter(document => document.id !== deleteTargetId));
    setDeleteTargetId(undefined);
  }

  function handleBack() {
    navigate(-1);
  }

  function handleNext() {
    const uploadedDocuments = documents.filter(document => document.status === 'uploaded');

    analytics.track(AnalyticsEvent.AnswerPreRdvQuestion, {
      screen_id: 'documents',
      question_id: 'documents',
      question_type: 'upload',
      answer_count: uploadedDocuments.length,
      time_spent_sec: Math.round((now() - enteredAtRef.current) / 1000),
      questionnaire_id: questionnaireId,
    });

    const nextState: DiagnosticDraftState = {
      ...state,
      documents: uploadedDocuments.map(document => document.file),
      questionnaireId,
    };
    navigate('/diagnostic/step-7', { state: nextState });
  }

  return (
    <div
      className={cn(
        'flex w-full flex-1 flex-col bg-white',
        // Figma's delete-confirm dialog mockup (node 6773:4146) shows nothing behind the
        // overlay but the header — its "Desktop" background frame only contains the logo bar,
        // no page content. RadixDialog.Portal renders the dialog itself outside this DOM
        // subtree, so hiding this wrapper while it's open hides only the page content (and the
        // mobile footer), leaving the header (rendered by the parent screen) and the dialog
        // both visible, matching the design exactly.
        deleteTargetId !== undefined && 'invisible'
      )}
    >
      <div className="flex flex-1 flex-col items-start px-8 pt-5 pb-28 lg:items-center lg:px-27">
        <div className="flex w-full flex-col gap-10 lg:w-124.5">
          <div className="flex w-full items-start gap-4">
            <div className="bg-secondary-50 flex size-8 shrink-0 items-center justify-center rounded-lg">
              <MoonIcon size={20} fillColor="headingPrimary" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-body-primary font-heading text-lg leading-6 font-medium tracking-[-0.4px]">
                Vos documents
              </p>
              <p className="text-body-secondary text-sm leading-5">
                Nous étudions vos documents avant votre venue afin de vous orienter au mieux.
              </p>
              <p className="text-body-secondary text-sm leading-5">
                Exemples : IRM pelvienne, échographie gynécologique, compte rendu opératoire,
                courrier médical, ordonnance, résultats de biologie, scanner, coloscopie…
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4">
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="hidden"
              onChange={handleInputChange}
            />
            {/* Figma nests the alert tight against the dropzone (gap-1/4px) as its own
                "errored" sub-group, distinct from the looser gap-4/16px between this group
                and the document-list card below (node 6771:3246). */}
            <div className={cn('flex w-full flex-col', error ? 'gap-1' : 'contents')}>
              {error && <Alert type="danger" description={error} />}

              <div
                role="button"
                tabIndex={0}
                onClick={handleDropzoneClick}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') handleDropzoneClick();
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={cn(
                  'bg-form-field-background flex min-h-[72px] w-full flex-col items-center gap-3 rounded-lg border border-dashed p-6 text-center',
                  error ? 'border-form-field-border-errored' : 'border-card-border'
                )}
              >
                <FileIcon
                  className={cn(
                    'size-6',
                    error ? 'text-form-field-text-errored' : 'text-heading-primary'
                  )}
                />
                <div className="flex w-full flex-col gap-2 text-sm leading-5">
                  <p className="text-body-primary w-full font-medium">
                    Déposez vos fichiers ici, ou cliquez pour parcourir
                  </p>
                  <p className="text-form-field-placeholder w-full">
                    Formats autorisés : PDF, JPG, PNG, maximum de 10mo
                  </p>
                </div>
              </div>
            </div>

            {documents.length > 0 && (
              <div className="border-card-border bg-neutral-white flex w-full flex-col items-start overflow-hidden rounded-lg border">
                {documents.map(document =>
                  document.status === 'uploading' ? (
                    <DocumentRow key={document.id} status="uploading" name={document.file.name} />
                  ) : (
                    <DocumentRow
                      key={document.id}
                      status="uploaded"
                      name={document.file.name}
                      onView={() => handleView(document)}
                      onDelete={() => setDeleteTargetId(document.id)}
                    />
                  )
                )}
              </div>
            )}
          </div>

          <div className="hidden w-full items-center justify-between lg:flex">
            <Button
              type="button"
              variant="neutral"
              size="icon-xl"
              onClick={handleBack}
              aria-label="Retour"
            >
              <ArrowBackIcon className="size-6" />
            </Button>
            <Button type="button" size="xl" className="gap-6" onClick={handleNext}>
              {nextLabel}
              <ArrowForwardIcon className="size-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 bg-white px-8 py-4 lg:hidden">
        <Button type="button" size="xl" className="w-full justify-between" onClick={handleNext}>
          {nextLabel}
          <ArrowForwardIcon className="size-6" />
        </Button>
      </div>

      <Dialog
        open={deleteTargetId !== undefined}
        onOpenChange={open => {
          if (!open) {
            if (confirmedDeleteRef.current) {
              confirmedDeleteRef.current = false;
            } else {
              analytics.track(AnalyticsEvent.DeleteDocument, {
                action: 'cancelled',
                documents_remaining_count: documents.length,
                questionnaire_id: questionnaireId,
              });
            }
            setDeleteTargetId(undefined);
          }
        }}
        type="danger"
        title="Supprimer ce document ?"
        description="Il fait déjà partie de votre dossier de pré-admission. Une fois supprimé, il ne pourra pas être récupéré."
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export { PatientDocuments };
