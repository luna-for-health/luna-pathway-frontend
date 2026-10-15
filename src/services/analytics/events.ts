/**
 * Event catalogue for the "Tracking plan patient" (Notion, Q3 2026 — Product team / Roadmap).
 * Mirrors the mobile app's Amplitude events where the plan marks them "Réutilisé" (family A),
 * plus the new `*_PRE_RDV_*` family for the web-only pre-appointment questionnaire (family B),
 * voice dictation (family C), and document upload (family D). `SET_PRE_RDV_STATUS` (#10 in the
 * plan) is intentionally absent — it's marked "Back" in the plan, fired by the API, not tracked
 * from here.
 */
export const AnalyticsEvent = {
  // Family A — reused from mobile, `platform`/`device_type` added on top of existing props.
  ClickMainSection: 'CLICK_MAIN_SECTION',
  GiveGdprConsent: 'GIVE_GDPR_CONSENT',
  OpenOnboardingScreen: 'OPEN_ONBOARDING_SCREEN',
  CompleteProfileStep: 'COMPLETE_PROFILE_STEP',
  SubmitAuthentication: 'SUBMIT_AUTHENTICATION',
  // Family B — new, web-only pre-appointment questionnaire.
  OpenPreRdvScreen: 'OPEN_PRE_RDV_SCREEN',
  StartPreRdvQuestionnaire: 'START_PRE_RDV_QUESTIONNAIRE',
  AnswerPreRdvQuestion: 'ANSWER_PRE_RDV_QUESTION',
  SubmitPreRdvQuestionnaire: 'SUBMIT_PRE_RDV_QUESTIONNAIRE',
  // Family C — voice dictation (patient story).
  StartVoiceInput: 'START_VOICE_INPUT',
  StopVoiceInput: 'STOP_VOICE_INPUT',
  // Family D — document upload.
  StartDocumentUpload: 'START_DOCUMENT_UPLOAD',
  CompleteDocumentUpload: 'COMPLETE_DOCUMENT_UPLOAD',
  DeleteDocument: 'DELETE_DOCUMENT',
  ViewDocument: 'VIEW_DOCUMENT',
  // Family E — secretary inbox ("Tracking plan" user story, Secrétaire). The plan's three

  ViewSecretaryInbox: 'VIEW_SECRETARY_INBOX',
  ViewInboxTab: 'VIEW_INBOX_TAB',
  ViewAppointmentRequest: 'VIEW_APPOINTMENT_REQUEST',
  CopyPatientInformation: 'COPY_PATIENT_INFORMATION',
  SearchSecretaryInbox: 'SEARCH_SECRETARY_INBOX',
  OpenAppointmentRequestDocument: 'OPEN_APPOINTMENT_REQUEST_DOCUMENT',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

/** `question_id` → `answer_value` normalization for `ANSWER_PRE_RDV_QUESTION` (reason_main). */
export const CONSULTATION_REASON_TRACKING_KEY: Record<string, string> = {
  diagnostic: 'diagnostic',
  douleurs: 'pain_relief',
  'projet-grossesse': 'pregnancy_project',
  'second-avis': 'second_opinion',
  suivi: 'follow_up',
};

export type PreRdvScreenId =
  | 'intro'
  | 'reason'
  | 'story'
  | 'symptoms'
  | 'imaging_recent'
  | 'documents'
  | 'summary'
  | 'success';

export type PreRdvScreenType =
  'intro' | 'single_select' | 'free_text' | 'scale' | 'upload' | 'summary' | 'confirmation';

/** The plan's inbox tab names — the app's own `reminder` tab is the plan's `callback`. */
export type InboxTabName = 'new' | 'callback' | 'processed';

/**
 * Props every request-linked secretary event carries (plan's "Règles métier"). Never any
 * patient data — only the request's internal id and where it was seen.
 */
export interface InboxRequestTrackingProperties {
  request_id: string;
  request_status: InboxTabName;
  source_tab: InboxTabName;
  /**
   * Required by the plan, but no center id is exposed to the web app yet (neither the secretary
   * login response nor `ConsultationRequestResource` carry one) — omitted until the API adds it
   * rather than sending a made-up value.
   */
  center_id?: string;
}

export interface AnalyticsEventProperties {
  [AnalyticsEvent.ClickMainSection]: {
    section_name: 'accueil' | 'annuaire' | 'dossier' | 'compte';
    nav_location: 'header' | 'mobile_menu';
  };
  [AnalyticsEvent.GiveGdprConsent]: {
    action: 'check' | 'uncheck';
    checkbox: 'data_processing' | 'terms';
    value: boolean;
    /**
     * No confirmed source for a policy/CGU version string in this app yet (`GdprItem` /
     * `GdprConsentData` don't carry one) — omit until the backend exposes it rather than
     * sending a made-up value.
     */
    policy_version?: string;
  };
  [AnalyticsEvent.OpenOnboardingScreen]: {
    screen_id:
      'signup_name' | 'signup_birthdate' | 'signup_location' | 'signup_phone' | 'gdpr_consent';
    flow: 'account_creation';
    step_number: number;
    screen_type: 'consent' | 'form';
  };
  [AnalyticsEvent.CompleteProfileStep]: {
    step: 'name' | 'birthdate' | 'location' | 'phone';
    status: 'success' | 'error';
    /** Only meaningful on the `phone` step — web auto-randomizes the avatar server-side on
     * register, there's no dedicated avatar-picker step here like mobile's `signup_avatar`. */
    avatar_set?: boolean;
  };
  [AnalyticsEvent.SubmitAuthentication]: Record<string, never>;
  [AnalyticsEvent.OpenPreRdvScreen]: {
    screen_id: PreRdvScreenId;
    step_number: number;
    screen_type: PreRdvScreenType;
    navigation_direction: 'forward' | 'backward' | 'direct';
    questionnaire_id: string;
  };
  [AnalyticsEvent.StartPreRdvQuestionnaire]: {
    entry_point: string;
    questionnaire_id: string;
  };
  [AnalyticsEvent.AnswerPreRdvQuestion]: {
    screen_id: PreRdvScreenId;
    question_id: 'reason_main' | 'story' | 'symptoms_eva' | 'imaging_recent' | 'documents';
    question_type: 'single_select' | 'multi_select' | 'free_text' | 'scale' | 'upload';
    /** Never the free-text story itself — normalized keys only (see
     * `CONSULTATION_REASON_TRACKING_KEY`) or a yes/no for imaging_recent. */
    answer_value?: string;
    answer_count?: number;
    input_method?: 'text' | 'voice' | 'mixed' | 'none';
    text_length?: number;
    time_spent_sec: number;
    questionnaire_id: string;
  };
  [AnalyticsEvent.SubmitPreRdvQuestionnaire]: {
    time_to_complete_sec: number;
    steps_completed_count: number;
    documents_count: number;
    story_input_method: 'text' | 'voice' | 'mixed' | 'none';
    questionnaire_id: string;
  };
  [AnalyticsEvent.StartVoiceInput]: {
    screen_id: 'story';
    questionnaire_id: string;
  };
  [AnalyticsEvent.StopVoiceInput]: {
    screen_id: 'story';
    duration_sec: number;
    status: 'success' | 'error';
    questionnaire_id: string;
  };
  [AnalyticsEvent.StartDocumentUpload]: {
    source: 'browse' | 'drag_drop';
    file_count: number;
    questionnaire_id: string;
  };
  [AnalyticsEvent.CompleteDocumentUpload]: {
    status: 'success' | 'failed';
    error_type?: 'invalid_type' | 'too_large';
    file_count: number;
    total_size_kb: number;
    file_types: string[];
    duration_sec: number;
    questionnaire_id: string;
  };
  [AnalyticsEvent.DeleteDocument]: {
    action: 'confirmed' | 'cancelled';
    documents_remaining_count: number;
    questionnaire_id: string;
  };
  [AnalyticsEvent.ViewDocument]: {
    file_type: string;
    questionnaire_id: string;
  };
  [AnalyticsEvent.ViewSecretaryInbox]: {
    new_request_count: number;
  };
  [AnalyticsEvent.ViewInboxTab]: {
    tab_name: InboxTabName;
    request_count: number;
  };
  [AnalyticsEvent.ViewAppointmentRequest]: InboxRequestTrackingProperties;
  [AnalyticsEvent.CopyPatientInformation]: InboxRequestTrackingProperties;
  [AnalyticsEvent.SearchSecretaryInbox]: {
    /** Never the search text itself — only whether it matched anything. */
    has_results: boolean;
  };
  [AnalyticsEvent.OpenAppointmentRequestDocument]: InboxRequestTrackingProperties & {
    /** File extension (`pdf`, `jpg`…) — never the file name. */
    document_type: string;
  };
}
