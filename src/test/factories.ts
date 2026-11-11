import type { ConsultationRequestResource } from '@/features/secretary-inbox/api';
import type { InboxRequest } from '@/features/secretary-inbox/types';

/** A complete inbox request; override only the fields a test cares about. */
export function makeInboxRequest(overrides: Partial<InboxRequest> = {}): InboxRequest {
  return {
    id: '1',
    status: 'new',
    patientName: 'Amel Ben Ali',
    receivedAt: '1 septembre 2026 - 12:32',
    patientInfo: { birthDate: '—', phone: '—', email: '—', postalAddress: '—' },
    consultationReason: 'diagnostic',
    story: '—',
    symptoms: [],
    documents: [],
    ...overrides,
  };
}

/** A complete API consultation request; override only the fields a test cares about. */
export function makeConsultationResource(
  overrides: Partial<ConsultationRequestResource> = {}
): ConsultationRequestResource {
  return {
    id: 42,
    reason: 'diagnostic',
    history: 'Douleurs depuis 2 ans',
    dysmenorrhea: 0,
    pelvicPain: 0,
    dyspareunia: 0,
    digestiveIssues: 0,
    urinaryIssues: 0,
    fatigue: 0,
    hasMri: false,
    status: 'new',
    statusReason: '',
    user: {
      id: 7,
      first_name: 'Amel',
      last_name: 'Ben Ali',
      email: 'amel@example.com',
      phone: '0612345678',
      birthdate: '1990-05-20',
      location: 'Marseille, France',
      avatar: 10,
      email_verified_at: null,
      has_accepted_gdpr: true,
      has_completed_onboarding: true,
    },
    documents: [],
    createdAt: null,
    ...overrides,
  };
}
