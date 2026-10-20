/** `ConsultationRequestStatus` from the API docs. `new` is the status a request is created with. */
export type ConsultationRequestStatus = 'new' | 'reminder' | 'validated' | 'treated';

/** Structured result of the background OCR job on an uploaded document. */
export interface ConsultationRequestDocumentOcr {
  title: string | null;
  /** Slug, e.g. `"compte_rendu"`. */
  category: string | null;
  /** Slug, e.g. `"cr_consultation"`. */
  subcategory: string | null;
  /** `DD/MM/YYYY`. */
  exam_date: string | null;
  conclusion: string | null;
}

export interface ConsultationRequestDocument {
  id: number;
  originalName: string;
  /** Null until the background OCR job completes. */
  ocrText: ConsultationRequestDocumentOcr | null;
  url: string;
}

/** The patient who submitted the request. */
export interface ConsultationRequestUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  /** `YYYY-MM-DD`. */
  birthdate: string | null;
  /** e.g. `"Paris, France"`. */
  location: string | null;
  avatar: number | null;
  email_verified_at: string | null;
  has_accepted_gdpr: boolean;
  has_completed_onboarding: boolean;
}

export interface ConsultationRequestResource {
  id: number;
  reason: string;
  history: string | null;
  /** EVA symptom scores, 0 (absent) … 10 (insupportable). */
  dysmenorrhea: number;
  pelvicPain: number;
  dyspareunia: number;
  digestiveIssues: number;
  urinaryIssues: number;
  fatigue: number;
  /** Whether the patient has an échographie/IRM dated less than 12 months. */
  hasMri: boolean;
  status: ConsultationRequestStatus;
  statusReason: string;
  user: ConsultationRequestUser;
  documents: ConsultationRequestDocument[];
  createdAt: string | null;
}

export interface UpdateConsultationRequestStatusPayload {
  status: ConsultationRequestStatus;
  /** Why a request was closed as `treated`. Not supported by the backend yet — requested. */
  status_reason?: string;
}

export interface ConsultationRequestsParams {
  status?: ConsultationRequestStatus;
  perPage?: number;
}
