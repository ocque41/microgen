/// <reference types="vite/client" />
/// <reference types="vite-imagetools" />

interface ImportMetaEnv
  extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_STACK_PROJECT_ID?: string;
  readonly VITE_STACK_PUBLISHABLE_CLIENT_KEY?: string;
  readonly STACK_SECRET_SERVER_KEY?: string;
  readonly DATABASE_URL?: string;
  readonly VITE_HERO_VIDEO_SOURCE?: string;
}
