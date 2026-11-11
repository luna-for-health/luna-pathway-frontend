import { describe, expect, it } from 'vitest';

import { mapDocumentOcr } from '@/features/secretary-inbox/lib/document-ocr';

const emptyOcr = {
  title: null,
  category: null,
  subcategory: null,
  exam_date: null,
  conclusion: null,
};

describe('mapDocumentOcr', () => {
  it('returns null when OCR has not run', () => {
    expect(mapDocumentOcr(null)).toBeNull();
    expect(mapDocumentOcr(undefined)).toBeNull();
  });

  it('returns null when OCR produced nothing usable', () => {
    expect(mapDocumentOcr({ ...emptyOcr, title: '   ' })).toBeNull();
  });

  it('maps known slugs to labels and trims values', () => {
    expect(
      mapDocumentOcr({
        title: '  IRM pelvienne ',
        category: 'compte_rendu',
        subcategory: 'cr_consultation',
        exam_date: '12/03/2026',
        conclusion: ' RAS ',
      })
    ).toEqual({
      title: 'IRM pelvienne',
      category: 'Compte rendu',
      subcategory: 'Compte rendu de consultation',
      examDate: '12/03/2026',
      conclusion: 'RAS',
    });
  });

  it('humanizes unknown slugs', () => {
    expect(mapDocumentOcr({ ...emptyOcr, subcategory: 'cr_imagerie-pelvienne' })?.subcategory).toBe(
      'Cr imagerie pelvienne'
    );
  });
});
