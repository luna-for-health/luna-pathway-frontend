import * as React from 'react';

export interface UseSpeechToTextOptions {
  /** BCP-47 language tag passed to the recognizer. Defaults to French, matching the app. */
  lang?: string;
  /** Called once per finalized phrase — not on every interim/in-progress word. */
  onResult: (transcript: string) => void;
}

export interface UseSpeechToTextResult {
  /** False on browsers without `SpeechRecognition`/`webkitSpeechRecognition` (currently just Firefox — Chromium browsers and Safari both support it via the `webkit`-prefixed constructor). */
  isSupported: boolean;
  isListening: boolean;
  toggle: () => void;
  /** Human-readable (French) message for the last fatal failure, or `null` when there isn't
   * one. Cleared as soon as a new listening attempt starts. See the fix note below — this
   * exists so a blocked/refused session is visible instead of the button silently doing
   * nothing. */
  error: string | null;
}

/** Errors that mean the session is dead and won't recover on its own — stop pretending we're
 * still listening rather than waiting on an `onend` that may never come (see below), and surface
 * why. */
const TERMINAL_ERROR_MESSAGES: Record<string, string> = {
  'not-allowed':
    "Micro refusé ou indisponible sur cette connexion. Vérifiez l'autorisation du micro pour ce site, ou ouvrez la page via une connexion sécurisée (https ou localhost) — la dictée est bloquée sur une adresse http normale sur mobile.",
  'service-not-allowed':
    "Micro refusé ou indisponible sur cette connexion. Vérifiez l'autorisation du micro pour ce site, ou ouvrez la page via une connexion sécurisée (https ou localhost) — la dictée est bloquée sur une adresse http normale sur mobile.",
  'audio-capture': 'Aucun micro détecté sur cet appareil.',
  network: 'La dictée vocale a besoin d’une connexion réseau.',
};
const TERMINAL_ERRORS = new Set(Object.keys(TERMINAL_ERROR_MESSAGES));

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

/**
 * Wraps the browser's (non-standard) Web Speech API for a push-to-toggle dictation button —
 * built for `PatientStory`'s mic button (Figma node 6527:4996), which had no wired behavior
 * until now. Works in Chromium-based browsers and Safari (both expose it as
 * `webkitSpeechRecognition`, confirmed working in Safari) — Firefox has no implementation.
 * No confirmed backend/cloud STT endpoint exists for this app, so this uses the
 * browser-native API directly rather than inventing a server-mediated flow; see project
 * memory for the tradeoffs discussed with the user before building this.
 *
 * `continuous: true` plus an auto-restart in `onend` keeps listening across the pauses natural
 * to describing a medical history out loud — Chrome silently ends recognition after each pause
 * otherwise. `shouldListenRef` distinguishes that auto-restart from the user's own `stop()` so
 * it doesn't immediately restart itself after being told to stop.
 *
 * **Mic-button-gets-stuck fix (2026-09-09, part 1):** on Android Chrome tested over a plain-http
 * LAN origin (e.g. `http://192.168.x.x:5173` — not `https` and not `localhost`, so not a "secure
 * context"), the browser refuses the mic and `start()` never really begins a session, but
 * `onend` either never fires or fires late — so the old code, which flipped `isListening` to
 * `true` *before* confirming the session actually started, left the button showing "recording"
 * forever with the stop tap doing nothing. Fixed by: only trusting `onstart` to say we're really
 * listening, treating a wider set of `onerror` codes as fatal (immediately clearing the UI
 * instead of only `shouldListenRef` and hoping `onend` follows), always resetting UI state the
 * instant the user taps stop rather than waiting on `onend`, and dropping the cached
 * `SpeechRecognition` instance after a failure so the next attempt builds a fresh one.
 *
 * **Part 2, same day:** part 1's fix then made a *blocked* session look like the button "does
 * nothing at all" instead of getting stuck — technically correct (no more fake "recording" UI),
 * but with zero feedback, which is indistinguishable from broken from the user's side. `error`
 * was added so the component can show *why* it failed (see `TERMINAL_ERROR_MESSAGES`) instead of
 * silently swallowing the failure. The `not-allowed` case is overwhelmingly the insecure-http
 * LAN origin problem described above on a real device — no code fix makes that path work; the
 * dev server needs to be reached over https or literally `localhost` (e.g. `adb reverse
 * tcp:<port> tcp:<port>` on Android) for the mic to be grantable at all.
 */
function useSpeechToText({
  lang = 'fr-FR',
  onResult,
}: UseSpeechToTextOptions): UseSpeechToTextResult {
  const [isListening, setIsListening] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const shouldListenRef = React.useRef(false);
  const onResultRef = React.useRef(onResult);

  React.useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const isSupported = React.useMemo(() => Boolean(getSpeechRecognitionConstructor()), []);

  const getRecognition = React.useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionCtor) return null;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      // Only now do we know a session is genuinely running — see the fix note above for why
      // this used to be set optimistically in `toggle` instead.
      setIsListening(true);
    };

    recognition.onresult = event => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) finalTranscript += result[0].transcript;
      }
      if (finalTranscript.trim()) onResultRef.current(finalTranscript.trim());
    };

    recognition.onerror = event => {
      // "no-speech"/"aborted" are routine (silence, or our own stop()) and `onend` handles
      // them. Anything else means this session isn't coming back — stop the UI immediately
      // instead of leaving the mic button stuck on "recording" waiting for an `onend` that may
      // never arrive (observed on Android Chrome when the page isn't a secure origin), and
      // surface why so a blocked session isn't indistinguishable from "nothing happened".
      if (TERMINAL_ERRORS.has(event.error)) {
        shouldListenRef.current = false;
        recognitionRef.current = null;
        setIsListening(false);
        setError(TERMINAL_ERROR_MESSAGES[event.error]);
      }
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        try {
          recognition.start();
          return;
        } catch {
          // Already starting/started, or the browser refused a restart — fall through and
          // report as stopped rather than loop.
        }
      }
      shouldListenRef.current = false;
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return recognition;
  }, [lang]);

  const toggle = React.useCallback(() => {
    if (shouldListenRef.current) {
      // Stop is always optimistic: reset the UI the instant the user asks, rather than waiting
      // on `onend`, which is exactly the event that was found not to reliably fire (see fix
      // note above) — a stop tap must never be a no-op.
      shouldListenRef.current = false;
      setIsListening(false);
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore — either already stopped, or never really started.
      }
      return;
    }

    const recognition = getRecognition();
    if (!recognition) return;

    setError(null);
    shouldListenRef.current = true;
    try {
      recognition.start();
    } catch {
      // Synchronous refusal (e.g. already running) — don't claim we're listening, and drop
      // this instance so the next attempt starts clean.
      shouldListenRef.current = false;
      recognitionRef.current = null;
      setIsListening(false);
      setError("La dictée n'a pas pu démarrer. Réessayez.");
    }
  }, [getRecognition]);

  React.useEffect(
    () => () => {
      shouldListenRef.current = false;
      recognitionRef.current?.stop();
    },
    []
  );

  return { isSupported, isListening, toggle, error };
}

export default useSpeechToText;
