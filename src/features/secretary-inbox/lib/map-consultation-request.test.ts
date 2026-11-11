import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  mapConsultationRequest,
  MISSING_VALUE,
} from '@/features/secretary-inbox/lib/map-consultation-request';
import { makeConsultationResource } from '@/test/factories';

describe('mapConsultationRequest', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 11, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('maps the patient and request fields', () => {
    const request = mapConsultationRequest(makeConsultationResource(), 'new');

    expect(request.id).toBe('42');
    expect(request.status).toBe('new');
    expect(request.patientName).toBe('Amel Ben Ali');
    expect(request.consultationReason).toBe('diagnostic');
    expect(request.story).toBe('Douleurs depuis 2 ans');
    expect(request.hasRecentImaging).toBe(false);
    expect(request.patientInfo).toEqual({
      birthDate: '20 mai 1990 (36 ans)',
      phone: '0612345678',
      email: 'amel@example.com',
      postalAddress: 'Marseille, France',
    });
  });

  it('computes the age before this year’s birthday', () => {
    const resource = makeConsultationResource();
    resource.user.birthdate = '1990-12-25';
    expect(mapConsultationRequest(resource, 'new').patientInfo.birthDate).toBe(
      '25 décembre 1990 (35 ans)'
    );
  });

  it('falls back to "—" for missing patient data', () => {
    const resource = makeConsultationResource({ history: null });
    resource.user = { ...resource.user, phone: null, birthdate: null, location: null };

    const request = mapConsultationRequest(resource, 'new');
    expect(request.story).toBe(MISSING_VALUE);
    expect(request.receivedAt).toBe(MISSING_VALUE);
    expect(request.patientInfo.phone).toBe(MISSING_VALUE);
    expect(request.patientInfo.birthDate).toBe(MISSING_VALUE);
    expect(request.patientInfo.postalAddress).toBe(MISSING_VALUE);
  });

  it('shows "—" for an unparseable birthdate', () => {
    const resource = makeConsultationResource();
    resource.user.birthdate = 'not-a-date';
    expect(mapConsultationRequest(resource, 'new').patientInfo.birthDate).toBe(MISSING_VALUE);
  });

  it('uses the request number when the patient has no name', () => {
    const resource = makeConsultationResource();
    resource.user = { ...resource.user, first_name: '', last_name: '' };
    expect(mapConsultationRequest(resource, 'new').patientName).toBe('Demande n°42');
  });

  it('keeps only scored symptoms, in questionnaire order, with their labels', () => {
    const request = mapConsultationRequest(
      makeConsultationResource({ fatigue: 3, dysmenorrhea: 8, pelvicPain: 0 }),
      'new'
    );
    expect(request.symptoms).toEqual([
      { id: 'dysmenorrhea', label: 'Douleur pendant les règles', score: 8 },
      { id: 'fatigue', label: 'Fatigue', score: 3 },
    ]);
  });

  it('sets the outcome only for validated or treated requests', () => {
    expect(
      mapConsultationRequest(makeConsultationResource({ status: 'treated' }), 'processed').outcome
    ).toBe('treated');
    expect(
      mapConsultationRequest(makeConsultationResource({ status: 'validated' }), 'processed').outcome
    ).toBe('validated');
    expect(
      mapConsultationRequest(makeConsultationResource({ status: 'reminder' }), 'reminder').outcome
    ).toBeUndefined();
  });

  it('maps a known status reason', () => {
    expect(
      mapConsultationRequest(makeConsultationResource({ statusReason: 'wrong-phone' }), 'processed')
        .processReason
    ).toBe('wrong-phone');
  });

  it('formats the reception date', () => {
    const createdAt = new Date(2026, 8, 1, 16, 16).toISOString();
    expect(mapConsultationRequest(makeConsultationResource({ createdAt }), 'new').receivedAt).toBe(
      '1 septembre 2026 - 16:16'
    );
  });

  it('maps documents', () => {
    const request = mapConsultationRequest(
      makeConsultationResource({
        documents: [
          { id: 5, originalName: 'irm.pdf', ocrText: null, url: 'https://files/irm.pdf' },
        ],
      }),
      'new'
    );
    expect(request.documents).toEqual([
      { id: '5', name: 'irm.pdf', ocrResult: null, url: 'https://files/irm.pdf' },
    ]);
  });
});
