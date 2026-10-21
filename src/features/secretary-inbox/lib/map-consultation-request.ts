import { SYMPTOMS } from '@/features/patient-questionnaire/lib/symptoms';
import type { ConsultationRequestResource } from '@/features/secretary-inbox/api';
import { mapDocumentOcr } from '@/features/secretary-inbox/lib/document-ocr';
import { formatInboxTimestamp } from '@/features/secretary-inbox/lib/format-inbox-timestamp';
import { toInboxProcessReason } from '@/features/secretary-inbox/lib/process-reasons';
import type {
  InboxRequest,
  InboxRequestStatus,
  InboxSymptomScore,
} from '@/features/secretary-inbox/types';

/** Shown where `ConsultationRequestResource` has no matching field yet. */
export const MISSING_VALUE = '—';

const BIRTHDATE_FORMATTER = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** `1990-05-20` → "20 mai 1990 (36 ans)", as in the Figma mocks. */
function formatBirthdate(birthdate: string | null): string {
  if (!birthdate) return MISSING_VALUE;
  const date = new Date(birthdate);
  if (Number.isNaN(date.getTime())) return MISSING_VALUE;

  const today = new Date();
  let age = today.getFullYear() - date.getUTCFullYear();
  const hadBirthday =
    today.getMonth() > date.getUTCMonth() ||
    (today.getMonth() === date.getUTCMonth() && today.getDate() >= date.getUTCDate());
  if (!hadBirthday) age -= 1;

  return `${BIRTHDATE_FORMATTER.format(date)} (${age} ans)`;
}

type SymptomScoreField =
  'dysmenorrhea' | 'pelvicPain' | 'dyspareunia' | 'digestiveIssues' | 'urinaryIssues' | 'fatigue';

/** `SYMPTOMS` ids (snake_case) → the API's camelCase score fields. */
const SYMPTOM_SCORE_FIELD: Record<string, SymptomScoreField> = {
  dysmenorrhea: 'dysmenorrhea',
  pelvic_pain: 'pelvicPain',
  dyspareunia: 'dyspareunia',
  digestive_issues: 'digestiveIssues',
  urinary_issues: 'urinaryIssues',
  fatigue: 'fatigue',
};

/** Symptoms the patient scored above 0, labeled and ordered like the questionnaire. */
function mapSymptoms(resource: ConsultationRequestResource): InboxSymptomScore[] {
  return SYMPTOMS.flatMap(symptom => {
    const field = SYMPTOM_SCORE_FIELD[symptom.id];
    const score = field ? Number(resource[field] ?? 0) : 0;
    return score > 0 ? [{ id: symptom.id, label: symptom.title, score }] : [];
  });
}

/**
 * Turns an API consultation request into the shape the inbox renders. `tab` is the tab
 * whose query returned it — "Traitée" merges the `validated` and `treated` queries.
 */
export function mapConsultationRequest(
  resource: ConsultationRequestResource,
  tab: InboxRequestStatus
): InboxRequest {
  const { user } = resource;
  const patientName = [user?.first_name, user?.last_name].filter(Boolean).join(' ');

  return {
    id: String(resource.id),
    status: tab,
    outcome:
      resource.status === 'validated' || resource.status === 'treated'
        ? resource.status
        : undefined,
    processReason: toInboxProcessReason(resource.statusReason),
    patientName: patientName || `Demande n°${resource.id}`,
    receivedAt: resource.createdAt
      ? formatInboxTimestamp(new Date(resource.createdAt))
      : MISSING_VALUE,
    patientInfo: {
      birthDate: formatBirthdate(user?.birthdate ?? null),
      phone: user?.phone || MISSING_VALUE,
      email: user?.email || MISSING_VALUE,
      postalAddress: user?.location || MISSING_VALUE,
    },
    consultationReason: resource.reason,
    story: resource.history ?? MISSING_VALUE,
    hasRecentImaging: resource.hasMri ?? undefined,
    symptoms: mapSymptoms(resource),
    documents: resource.documents.map(document => ({
      id: String(document.id),
      name: document.originalName,
      ocrResult: mapDocumentOcr(document.ocrText),
      url: document.url,
    })),
  };
}
