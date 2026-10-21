const GOOGLE_IDENTITY_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const GOOGLE_USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/userinfo';

interface GoogleTokenResponse {
  access_token: string;
  error?: string;
  error_description?: string;
}

interface GoogleTokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: GoogleTokenResponse) => void;
  error_callback?: (error: { type: string; message?: string }) => void;
}

interface GoogleTokenClient {
  requestAccessToken: () => void;
}

interface GoogleUserInfo {
  given_name?: string;
  family_name?: string;
}

export interface GoogleSignInResult {
  accessToken: string;
  firstName?: string;
  lastName?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: GoogleTokenClientConfig) => GoogleTokenClient;
        };
      };
    };
  }
}

let scriptLoadPromise: Promise<void> | null = null;

function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoadPromise = null;
      reject(new Error('Impossible de charger Google Identity Services.'));
    };
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

function requestGoogleAccessToken(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Identity Services indisponible.'));
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: response => {
        if (response.error) {
          reject(new Error(response.error_description ?? response.error));
          return;
        }
        resolve(response.access_token);
      },
      error_callback: error => {
        reject(new Error(error.message ?? 'Connexion Google annulée.'));
      },
    });

    client.requestAccessToken();
  });
}

/**
 * Fetches the signed-in user's profile from Google's userinfo endpoint using the access
 * token obtained above. The token-client flow only ever hands back an access token, never
 * the profile itself, so this is a required second call to actually get a name. Best-effort:
 * if it fails (network hiccup, revoked scope), sign-in still succeeds with no prefilled name
 * rather than blocking the user.
 */
async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  try {
    const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return {};
    return (await response.json()) as GoogleUserInfo;
  } catch {
    return {};
  }
}

/**
 * Opens Google's OAuth2 token-client popup and resolves with an access token plus the
 * user's first/last name (best-effort, via `fetchGoogleUserInfo`) — the access token is the
 * same credential shape the mobile app already sends to `POST /oauth/signup/:provider`
 * (`@react-native-google-signin/google-signin`'s `getTokens().accessToken`) — kept
 * consistent here rather than using GIS's ID-token/One Tap flow, since the backend
 * contract expects an OAuth access token, not a JWT. The name is used only to prefill
 * `/account/step-1`'s form — never sent anywhere the user hasn't reviewed first.
 */
export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  await loadGoogleIdentityScript();
  const accessToken = await requestGoogleAccessToken();
  const { given_name: firstName, family_name: lastName } = await fetchGoogleUserInfo(accessToken);
  return { accessToken, firstName, lastName };
}
