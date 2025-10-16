/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly FORM_WEBHOOK_URL?: string;
  readonly PUBLIC_ANALYTICS_ENDPOINT?: string;
  readonly SUPABASE_DB_URL?: string;
  readonly SUPABASE_DB_POOL_MAX?: string;
  readonly SUPABASE_DB_IDLE_TIMEOUT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
