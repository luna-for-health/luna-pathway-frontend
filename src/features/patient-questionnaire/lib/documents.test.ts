import { describe, expect, it } from 'vitest';

import {
  getFileExtension,
  MAX_DOCUMENT_SIZE_BYTES,
  validateDocumentFile,
} from '@/features/patient-questionnaire/lib/documents';

function makeFile(name: string, type: string, size = 1024) {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('validateDocumentFile', () => {
  it('accepts PDF, JPG and PNG files under 10 MB', () => {
    expect(validateDocumentFile(makeFile('report.pdf', 'application/pdf'))).toBeUndefined();
    expect(validateDocumentFile(makeFile('scan.jpg', 'image/jpeg'))).toBeUndefined();
    expect(validateDocumentFile(makeFile('scan.png', 'image/png'))).toBeUndefined();
  });

  it('accepts a known extension even when the browser gives no MIME type', () => {
    expect(validateDocumentFile(makeFile('REPORT.PDF', ''))).toBeUndefined();
  });

  it('rejects unsupported formats', () => {
    expect(validateDocumentFile(makeFile('notes.docx', 'application/msword'))).toEqual({
      message: 'Ce format n’est pas pris en charge. Essayez avec un PDF, JPG ou PNG.',
      type: 'invalid_type',
    });
  });

  it('rejects files over 10 MB', () => {
    expect(
      validateDocumentFile(makeFile('big.pdf', 'application/pdf', MAX_DOCUMENT_SIZE_BYTES + 1))
    ).toEqual({
      message: 'Ce fichier dépasse la taille autorisée (10 Mo max).',
      type: 'too_large',
    });
  });

  it('accepts a file of exactly 10 MB', () => {
    expect(
      validateDocumentFile(makeFile('max.pdf', 'application/pdf', MAX_DOCUMENT_SIZE_BYTES))
    ).toBeUndefined();
  });
});

describe('getFileExtension', () => {
  it('returns the lowercased extension without the dot', () => {
    expect(getFileExtension('Scan.JPG')).toBe('jpg');
    expect(getFileExtension('archive.tar.gz')).toBe('gz');
  });

  it('returns "unknown" when there is no extension', () => {
    expect(getFileExtension('README')).toBe('unknown');
  });
});
