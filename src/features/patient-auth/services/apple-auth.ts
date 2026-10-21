const APPLE_ID_SCRIPT_SRC =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

interface AppleAuthInitConfig {
  clientId: string;
  scope: string;
  redirectURI: string;
  usePopup: boolean;
}

interface AppleAuthorization {
  id_token: string;
  code?: string;
}

interface AppleAuthorizationUserName {
  firstName?: string;
  lastName?: string;
}

interface AppleAuthorizationUser {
  email?: string;
  name?: AppleAuthorizationUserName;
}

interface AppleSignInResponse {
  authorization: AppleAuthorization;
  // Apple only includes this on the very first authorization a person ever grants this
  // app — every sign-in after that omits it entirely, so it must be captured opportunistically.
  user?: AppleAuthorizationUser;
}

interface AppleIdNamespace {
  auth: {
    init: (config: AppleAuthInitConfig) => void;
    signIn: () => Promise<AppleSignInResponse>;
  };
}

declare global {
  interface Window {
    AppleID?: AppleIdNamespace;
  }
}

export interface AppleSignInResult {
  idToken: string;
  firstName?: string;
  lastName?: string;
}

let scriptLoadPromise: Promise<void> | null = null;

function loadAppleIdScript(): Promise<void> {
  if (window.AppleID) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = APPLE_ID_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoadPromise = null;
      reject(new Error('Impossible de charger Sign in with Apple.'));
    };
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

/**
 * Resolves an Apple identity token (a JWT) via Apple's JS SDK popup flow — the same kind
 * of credential mobile's `AppleAuthButton` sends to `POST /oauth/signup/apple` via
 * `expo-apple-authentication`'s `credential.identityToken`, kept in the same
 * `access_token` payload field for backend-contract consistency.
 *
 * Also opportunistically captures `firstName`/`lastName` from `authorization`'s sibling
 * `user` field — used only to prefill `/account/step-1`'s form. Apple's JWT (`id_token`)
 * never carries a name claim, and Apple sends the `user` object at most once per person
 * (their very first authorization), so this can legitimately come back empty on every
 * later sign-in — that's expected, not a bug, and the form falls back to blank fields.
 *
 * NOT YET USABLE IN ANY ENVIRONMENT: there is no real Sign in with Apple Services ID,
 * verified domain, or registered redirect URI yet — Apple requires a real, publicly
 * reachable HTTPS domain to register (unlike Google, it will not accept `localhost`),
 * and this app isn't deployed anywhere yet. `VITE_APPLE_CLIENT_ID`/
 * `VITE_APPLE_REDIRECT_URI` are intentionally left empty until that setup happens; this
 * throws a clear, explicit error in that case rather than calling Apple's SDK with
 * garbage values and failing inside it with a confusing error.
 */
export async function signInWithApple(): Promise<AppleSignInResult> {
  const clientId = import.meta.env.VITE_APPLE_CLIENT_ID;
  const redirectURI = import.meta.env.VITE_APPLE_REDIRECT_URI;

  if (!clientId || !redirectURI) {
    throw new Error("La connexion avec Apple n'est pas encore configurée pour cet environnement.");
  }

  await loadAppleIdScript();

  if (!window.AppleID) {
    throw new Error('Sign in with Apple indisponible.');
  }

  window.AppleID.auth.init({
    clientId,
    scope: 'name email',
    redirectURI,
    usePopup: true,
  });

  const response = await window.AppleID.auth.signIn();
  return {
    idToken: response.authorization.id_token,
    firstName: response.user?.name?.firstName,
    lastName: response.user?.name?.lastName,
  };
}
