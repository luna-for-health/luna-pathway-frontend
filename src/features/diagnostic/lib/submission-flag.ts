/**
 * sessionStorage "consume-once" flag distinguishing a genuine post-submission navigation to
 * `/diagnostic/confirmation` from a page reload or direct URL access.
 *
 * Route state (`location.state`) can't be used for this: browsers preserve the current
 * session-history entry's `history.state` across a reload, so a flag passed via
 * `navigate(path, { state })` would still be there after the user hits reload — the guard would
 * never trigger. sessionStorage isn't tied to a history entry, so it can be consumed (removed)
 * the first time the confirmation screen reads it, making it absent on any later reload.
 *
 * `markJustSubmitted` is called right before navigating to the confirmation screen on a
 * successful submit (`RequestSummary.handleValidate`). `consumeJustSubmitted` is called once, on
 * mount, by the confirmation screen (`Confirmation`): it reports whether the flag was present and
 * removes it either way.
 */
const JUST_SUBMITTED_KEY = 'luna:diagnostic-just-submitted';

function markJustSubmitted() {
  sessionStorage.setItem(JUST_SUBMITTED_KEY, '1');
}

function consumeJustSubmitted(): boolean {
  const wasSet = sessionStorage.getItem(JUST_SUBMITTED_KEY) === '1';
  sessionStorage.removeItem(JUST_SUBMITTED_KEY);
  return wasSet;
}

export { consumeJustSubmitted, markJustSubmitted };
