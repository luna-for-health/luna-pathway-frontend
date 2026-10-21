import type { InboxProcessReason } from '@/features/secretary-inbox/lib/process-reasons';

export type InboxRequestStatus = 'new' | 'reminder' | 'processed';

export type InboxRequestOutcome = 'validated' | 'treated';

export interface InboxDocumentOcr {
  title: string | null;
  /** Display labels, already mapped from the API slugs. */
  category: string | null;
  subcategory: string | null;
  /** `DD/MM/YYYY`. */
  examDate: string | null;
  conclusion: string | null;
}

export interface InboxDocument {
  id: string;
  name: string;
  /** Null until the background OCR job completes. */
  ocrResult: InboxDocumentOcr | null;
  url: string;
}

export interface InboxSymptomScore {
  /** Snake-case symptom id, as in `SYMPTOMS` (diagnostic flow). */
  id: string;
  label: string;
  /** EVA score, 1 … 10 — symptoms scored 0 (absent) are left out. */
  score: number;
}

export interface InboxPatientInfo {
  birthDate: string;
  phone: string;
  email: string;
  postalAddress: string;
}

export interface InboxRequest {
  id: string;
  status: InboxRequestStatus;
  patientName: string;
  receivedAt: string;
  patientInfo: InboxPatientInfo;
  consultationReason: string;
  /** Not returned by the API yet — rendered as "—" when unknown. */
  hasRecentImaging?: boolean;
  story: string;
  /** Rated symptoms, in questionnaire order. */
  symptoms: InboxSymptomScore[];
  documents: InboxDocument[];
  /** How a processed request was closed: "RDV validé" or "Traitée" (API `validated` / `treated`). */
  outcome?: InboxRequestOutcome;
  processReason?: InboxProcessReason;
  /** When the request left the "Nouveau" tab. Falls back to `receivedAt` when unknown. */
  processedAt?: string;
}

export interface InboxListItemProps {
  patientName: string;
  receivedAt: string;
  active?: boolean;
  onClick?: () => void;
}

export interface InboxListProps {
  requests: InboxRequest[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export interface InboxPatientInfoCardProps {
  info: InboxPatientInfo;
  /** Called once the info was actually written to the clipboard. */
  onCopy?: () => void;
}

export interface InboxDetailFieldProps {
  label: string;
  value: string;
}

export interface InboxSymptomsProps {
  symptoms: InboxSymptomScore[];
}

export interface InboxDocumentsProps {
  documents: InboxDocument[];
  /** Called once a document was downloaded and handed to the new tab. */
  onOpen?: (document: InboxDocument) => void;
}

export interface InboxDetailsProps {
  request: InboxRequest;
  /**
   * "RDV validé" / "A rappeler" ("A rappeler" is hidden for a reminder). Passed for a new
   * request, a reminder, and one archived through the reason modal (Figma node 7573:2432).
   */
  onStatusChange?: (status: InboxRequestStatus) => void;
  /** "Traitée" — only passed for a new request or a reminder. */
  onProcess?: (reason: InboxProcessReason) => void;
  /**
   * Close (×) button beside the patient name — returns to the full-width list. Only passed for
   * the "Rappel" / "Traitée" detail view (Figma node 7568:622 → back to 7504:7247).
   */
  onClose?: () => void;
}

export interface InboxProcessRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: InboxProcessReason) => void;
}
