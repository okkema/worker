# worker

[Cloudflare Workers](https://developers.cloudflare.com/workers/) Toolkit

![Version](https://img.shields.io/npm/v/@okkema/worker?logo=npm)
![Example](https://img.shields.io/github/actions/workflow/status/okkema/worker/push-example.yaml?branch=main&label=example&logo=cloudflare)
![Issues](https://img.shields.io/github/issues/okkema/worker?logo=github)

## Modules

The `core` module is exported at the root of the package. All other modules are scoped to their respective names.

### [`core`](./src/core/)

`Worker` that provides high level error handling, returning [Problem Details](https://datatracker.ietf.org/doc/html/rfc7807) responses. 

### [`auth`](./src/auth/)

Functions for working with [JSON Web Keys](https://datatracker.ietf.org/doc/html/rfc7517) and [JSON Web Tokens](https://datatracker.ietf.org/doc/html/rfc7519).

### [`crypto`](./src/crypto/)

Functions for working with [RSA PKCS](https://datatracker.ietf.org/doc/html/rfc3447) keys.

### [`sentry`](./src/sentry)

`Logger` implementation for reporting errors to [Sentry](https://docs.sentry.io/).

### [`utils`](./src/utils/)

Miscellaneous functions for:

- Sanitizing objects by removing unknown values and optionally nulls


## Usage

Check out the [`example`](./example) for more details.
