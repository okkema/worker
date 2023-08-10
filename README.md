# worker

Cloudflare Worker Web Framework

![Version](https://img.shields.io/npm/v/@okkema/worker)
![Status](https://img.shields.io/github/workflow/status/okkema/worker/push-example)
![Issues](https://img.shields.io/github/issues/okkema/worker)
![License](https://img.shields.io/github/license/okkema/worker)
![Size](https://img.shields.io/bundlephobia/min/@okkema/worker)

## Intro

A simple web framework for [Cloudflare Workers](https://workers.cloudflare.com/). 

This package is organized into sub modules:
- `core` - core functionality exported at root
- `sentry` - logger for [Sentry](https://sentry.io)
- `sendgrid` - emailer for [SendGrid](https://sendgrid.com)
- `stripe` - webhook for [Stripe](https://stripe.com) and limited API client (WIP)

Heavily ~~ripped from~~ *inspired by*: [^1]
- [itty-router](https://github.com/kwhitley/itty-router)
- [cfworker](https://github.com/cfworker/cfworker)
- [worker-tools](https://github.com/worker-tools)
- [worktop](https://github.com/lukeed/worktop)
- Probably others!

[^1]: MIT FTW
## Usage

Check out the [example](/example) for more details.

### Worker

```ts
import Worker from "@okkema/worker"     // import like this
import { Worker } from "@okkema/worker" // or like this

const fetch = async (event: FetchEvent) => {
  const { request } = event

  // handle the request or event....

  return new Response("handled!")
}

Worker({ fetch })
```

### Router

```ts
import { Router, Worker } from "@okkema/worker"

const router = Router({
  base: "/api", // this is optional
})

// add routes like this
router.use({
  method: "GET",
  path: "/cats",
  handler: [async (request: Request) => new Response("cats!")],
})

// or use a shortcut
router.get("/dogs", async (request) => new Response("dogs!"))

Worker({
  fetch: (event) => router.handle(event.request),
})
```

### Problem Details
```ts
import { Problem, Worker } from "@okkema/worker"

Worker({
  fetch: (event) => {
    // returns a Problem Details response
    throw new Problem({
      title: "Check out the RFC for more details",
      detail: "https://datatracker.ietf.org/doc/html/rfc7807",
      status: 500,
    })
  }
})
```

### CORS
```ts
import { Worker } from "@okkema/worker"
import type { CORS } from "@okkema/worker"

const cors: CORS = {
  origin: "https://domain.tld", // Access-Control-Allow-Origin
  methods: ["GET", "POST"],     // Access-Control-Allow-Methods
  headers: ["X-Custom-Header"], // Access-Control-Allow-Headers
}

Worker({
  fetch: (event) => new Response("CORS configured response!"),
  cors,
})
```

### Sentry Logger
```ts
import { Worker } from "@okkema/worker"
import { Logger } from "@okkema/worker/sentry"

const DSN = "YOUR_SENTRY_DSN" // https://docs.sentry.io/product/sentry-basics/dsn-explainer/

const logger = Logger({ DSN })

// automatically logs any errors
Worker({
  fetch: (event) => { throw new Error("Whoops...") },
  logger,
})
```

You can also implement your own loggers!

```ts
import type { Logger } from "@okkema/worker" // import the type for code completion

const mySuperLogger: Logger = {
  log: async (event: FetchEvent, error: Error) => {
    
    // log your error wherever...
    
    // return a boolean indicating success
    return true
  }
}

Worker({
  fetch: (event) => { throw new Error("Not again...") },
  logger: mySuperLogger,
})
```

### Contributing

PRs are welcome. Issues are also welcome, just don't be a dick.

### WIP

- [Auth0](https://auth0.com/) JWT validator
- [Stripe](https://stripe.com/) Expanded API client
- [SendGrid](https://sendgrid.com/) Expanded emailer
- And gobs more!