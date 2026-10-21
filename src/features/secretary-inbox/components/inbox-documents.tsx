import { Button } from '@/components/ui';
import { getConsultationRequestDocument } from '@/features/secretary-inbox/api';
import type {
  InboxDocument,
  InboxDocumentOcr,
  InboxDocumentsProps,
} from '@/features/secretary-inbox/types';
import { ExternalLinkIcon } from '@/icons';

/** Long enough for the new tab to load the file before its blob URL is released. */
const BLOB_URL_LIFETIME_MS = 60_000;

/**
 * Opens the tab synchronously — a `window.open` after an `await` is caught by pop-up
 * blockers — then points it at the downloaded file. Resolves to whether it succeeded.
 */
async function openDocument(url: string): Promise<boolean> {
  const tab = window.open('', '_blank');
  try {
    const blob = await getConsultationRequestDocument(url);
    const blobUrl = URL.createObjectURL(blob);
    if (tab) tab.location.href = blobUrl;
    else window.open(blobUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(blobUrl), BLOB_URL_LIFETIME_MS);
    return true;
  } catch {
    tab?.close();
    return false;
  }
}

function InboxDocumentOcrSummary({ ocr }: { ocr: InboxDocumentOcr }) {
  const meta = [ocr.subcategory ?? ocr.category, ocr.examDate].filter(Boolean).join(' · ');

  return (
    <div className="bg-neutral-05 flex w-full flex-col items-start gap-1 rounded-lg p-2">
      {ocr.title && <p className="text-body-primary text-sm font-medium">{ocr.title}</p>}
      {meta && <p className="text-body-tertiary text-xs">{meta}</p>}
      {ocr.conclusion && <p className="text-body-secondary pt-1 text-sm">{ocr.conclusion}</p>}
    </div>
  );
}

export function InboxDocuments({ documents, onOpen }: InboxDocumentsProps) {
  async function handleOpen(document: InboxDocument) {
    if (await openDocument(document.url)) onOpen?.(document);
  }

  if (documents.length === 0) return null;

  return (
    <div className="flex w-full flex-col items-start gap-4 py-8">
      <p className="text-body-primary text-base font-medium">Documents</p>
      <div className="flex w-full flex-col items-start gap-2">
        {documents.map(document => (
          <div key={document.id} className="flex w-full flex-col items-start gap-2 px-1">
            <div className="flex w-full items-center gap-2">
              <p className="text-body-primary flex-1 text-sm font-medium">{document.name}</p>
              <Button
                variant="white"
                size="icon-pill"
                aria-label={`Voir ${document.name}`}
                onClick={() => void handleOpen(document)}
              >
                <ExternalLinkIcon className="size-5" />
              </Button>
            </div>
            {document.ocrResult && <InboxDocumentOcrSummary ocr={document.ocrResult} />}
          </div>
        ))}
      </div>
    </div>
  );
}
