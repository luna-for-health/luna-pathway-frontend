import * as amplitude from '@amplitude/analytics-browser';

import type { AnalyticsEventName, AnalyticsEventProperties } from './events';

const apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY;

/** Matches the app's own `lg:` Tailwind breakpoint (1024px) so `device_type` lines up with
 * every other desktop/mobile split already made across the UI. */
const DESKTOP_BREAKPOINT_QUERY = '(min-width: 1024px)';

let initialized = false;

function getDeviceType(): 'desktop' | 'mobile' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'mobile';
  return window.matchMedia(DESKTOP_BREAKPOINT_QUERY).matches ? 'desktop' : 'mobile';
}

/** Same `navigator.language` pattern already used for `Accept-Language` (api-client.ts) and
 * the OAuth `locale` payload field (login-form.tsx) — kept consistent rather than adding a
 * second way to derive it. */
function getLocale() {
  return navigator.language.split('-')[0] || 'fr';
}

/** Props sent on every event — the tracking plan's "props communes envoyées partout" callout. */
function commonProperties() {
  return {
    platform: 'web' as const,
    device_type: getDeviceType(),
    locale: getLocale(),
  };
}

/**
 * Starts Amplitude. Safe to call once at app startup; a no-op when no API key is configured
 * (e.g. local dev before a key is set) so the app never crashes on a missing env var.
 *
 * Autocapture is intentionally conservative for a healthcare app: page views and sessions are
 * safe to capture automatically, but form interactions and file downloads are left off since
 * Luna's forms and documents can carry patient data we don't want Amplitude auto-collecting
 * metadata about. Everything else is tracked explicitly via `track()` against the typed event
 * catalogue in `./events`.
 */
function init() {
  if (initialized || !apiKey) return;

  amplitude.init(apiKey, {
    serverZone: 'EU',
    // Amplitude rejects (HTTP 400 "Invalid id length") every event whose user_id is shorter
    // than 5 characters by default. Our patient ids are short numbers (`identify(42)` → "42"),
    // so once a patient logged in, all their events were silently dropped — only anonymous
    // traffic (e.g. the secretary side, which never calls `identify`) reached Amplitude.
    minIdLength: 1,
    defaultTracking: {
      pageViews: true,
      sessions: true,
      formInteractions: false,
      fileDownloads: false,
    },
  });
  initialized = true;
}

/** Tracks a custom event against the typed catalogue in `./events`, with the common
 * `platform`/`device_type`/`locale` props merged in automatically. No-op until `init()` has
 * run with a valid API key. */
function track<E extends AnalyticsEventName>(event: E, properties: AnalyticsEventProperties[E]) {
  if (!initialized) return;
  amplitude.track(event, { ...commonProperties(), ...properties });
}

/**
 * Associates the current session with a logged-in user. Call this right after auth succeeds
 * (alongside `tokenStorage.set(...)`) so events from this session onward roll up to the right
 * user.
 */
function identify(userId: string | number) {
  if (!initialized) return;
  amplitude.setUserId(String(userId));
}

/** Clears the identified user (e.g. on logout) so a new anonymous session starts. */
function reset() {
  if (!initialized) return;
  amplitude.reset();
}

export const analytics = { init, track, identify, reset };
