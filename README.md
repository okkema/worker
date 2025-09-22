# worker

[Cloudflare Workers](https://developers.cloudflare.com/workers/) Toolkit

![Version](https://img.shields.io/npm/v/@okkema/worker?logo=npm)
![Example](https://img.shields.io/github/actions/workflow/status/okkema/worker/push-example.yaml?branch=main&label=example&logo=cloudflare)
![Issues](https://img.shields.io/github/issues/okkema/worker?logo=github)

## Modules

### [`api`](./src/api/)

[Hono](https://hono.dev/) application with routes and middleware for handling login, authentication, and authorization.


### [`auth`](./src/auth/)

Functions for working with [JSON Web Keys](https://datatracker.ietf.org/doc/html/rfc7517), [JSON Web Tokens](https://datatracker.ietf.org/doc/html/rfc7519), and [Oauth2](https://datatracker.ietf.org/doc/html/rfc6749) service client that uses `client_credentials` grant.

### [`core`](./src/core/)

[Problem Details](https://datatracker.ietf.org/doc/html/rfc7807) errors, type helpers, and miscellaneous functions. 

### [`crypto`](./src/crypto/)

Functions for working with [RSA PKCS](https://datatracker.ietf.org/doc/html/rfc3447) keys.

### [`google`](./src/google/)

Service clients Oauth2, Google Sheets, and Google Cloud Run functions.

### [`sentry`](./src/sentry)

Worker wrapper reporting errors and logs to [Sentry](https://docs.sentry.io/).

### [`web`](./src/web)

[Astro](https://astro.build/) web framework with routes and middleware for handling login, authentication, authorization, and sending errors and logs to Sentry.


## Usage

Check out the [`example`](./example) for more details.
