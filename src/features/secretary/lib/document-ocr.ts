import type { ConsultationRequestDocumentOcr } from '@/features/secretary/api';
import type { InboxDocumentOcr } from '@/features/secretary/types';

/** Known OCR category/subcategory slugs → display labels. Unknown slugs fall back to `humanizeSlug`. */
const OCR_LABELS: Record<string, string> = {
  compte_rendu: 'Compte rendu',
  cr_consultation: 'Compte rendu de consultation',
};

/** `"cr_imagerie"` → "Cr imagerie". */
function humanizeSlug(slug: string): string {
  const text = slug.replace(/[_-]+/g, ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toLabel(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return OCR_LABELS[slug] ?? humanizeSlug(slug);
}

function clean(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Maps the API's structured `ocrText` to the inbox's display shape. Returns null when the OCR
 * job hasn't run yet or produced nothing usable, so the UI can skip the block entirely.
 */
export function mapDocumentOcr(
  ocr: ConsultationRequestDocumentOcr | null | undefined
): InboxDocumentOcr | null {
  if (!ocr || typeof ocr !== 'object') return null;

  const result: InboxDocumentOcr = {
    title: clean(ocr.title),
    category: toLabel(clean(ocr.category)),
    subcategory: toLabel(clean(ocr.subcategory)),
    examDate: clean(ocr.exam_date),
    conclusion: clean(ocr.conclusion),
  };

  return Object.values(result).some(Boolean) ? result : null;
}
