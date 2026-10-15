/// <reference types="vite/client" />

/**
 * Typed environment variables.
 * Real values live in .env.development / .env.production (git-ignored).
 * See .env.example for the list of required variables.
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_APPLE_CLIENT_ID: string;
  readonly VITE_APPLE_REDIRECT_URI: string;
  readonly VITE_AMPLITUDE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
