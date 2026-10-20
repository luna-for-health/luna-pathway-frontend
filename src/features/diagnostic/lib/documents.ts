export type PatientDocumentStatus = 'uploading' | 'uploaded';

export interface PatientDocument {
  id: string;
  file: File;
  status: PatientDocumentStatus;
}

export const ACCEPTED_DOCUMENT_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
export const ACCEPTED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;

const UNSUPPORTED_FORMAT_ERROR =
  'Ce format n’est pas pris en charge. Essayez avec un PDF, JPG ou PNG.';
const FILE_TOO_LARGE_ERROR = 'Ce fichier dépasse la taille autorisée (10 Mo max).';

function hasAcceptedExtension(filename: string) {
  const lower = filename.toLowerCase();
  return ACCEPTED_DOCUMENT_EXTENSIONS.some(extension => lower.endsWith(extension));
}

export interface DocumentValidationError {
  message: string;
  /** `CompleteDocumentUpload`'s `error_type` — kept as a typed code alongside the display
   * message rather than matching on the French string at the tracking call site. */
  type: 'invalid_type' | 'too_large';
}

/**
 * Matches "step 3 / upload error" (Figma node `6771:3246`) exactly — its Alert annotation
 * lists these same two messages verbatim, one shown at a time. No confirmed backend endpoint
 * exists for this step yet, so this is purely client-side validation.
 */
export function validateDocumentFile(file: File): DocumentValidationError | undefined {
  const typeIsAccepted =
    ACCEPTED_DOCUMENT_TYPES.includes(file.type) || hasAcceptedExtension(file.name);

  if (!typeIsAccepted) return { message: UNSUPPORTED_FORMAT_ERROR, type: 'invalid_type' };
  if (file.size > MAX_DOCUMENT_SIZE_BYTES)
    return { message: FILE_TOO_LARGE_ERROR, type: 'too_large' };
  return undefined;
}

/** Extension without the leading dot, lowercased (e.g. `pdf`, `jpg`) — used for the
 * `file_type(s)` tracking props rather than the raw MIME type. */
export function getFileExtension(filename: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(filename);
  return match ? match[1].toLowerCase() : 'unknown';
}
