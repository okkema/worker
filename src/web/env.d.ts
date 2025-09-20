/// <reference types="astro/client" />
export type Environment = {
  CF_PAGES_COMMIT_SHA?: string;
  SENTRY_DSN: string
  OAUTH_AUDIENCE: string
  OAUTH_CLIENT_ID: string
  OAUTH_CLIENT_SECRET: string
  OAUTH_TENANT: string
  OAUTH_SCOPE: string
}
type Runtime = import("@astrojs/cloudflare").Runtime<Environment>
type JsonWebToken = import("../auth").JsonWebToken
declare global {
  namespace App {
    interface Locals extends Runtime {
      jwt?: JsonWebToken
    }
  }
}