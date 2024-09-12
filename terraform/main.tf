locals {
  secrets = {
    "TF_API_TOKEN" : var.TF_API_TOKEN,
    "ACTIONS_GITHUB_TOKEN" : var.ACTIONS_GITHUB_TOKEN
    "NPM_TOKEN" : var.NPM_TOKEN
  }
}

module "secrets" {
  for_each = local.secrets

  source  = "app.terraform.io/okkema/secret/github"
  version = "~> 0.2"

  repository = var.github_repository
  key        = each.key
  value      = each.value
}

module "worker" {
  source  = "app.terraform.io/okkema/worker/cloudflare"
  version = "~> 0.14"

  account_id          = var.cloudflare_account_id
  zone_id             = var.cloudflare_zone_id
  name                = var.github_repository
  content             = file(abspath("${path.module}/../example/dist/index.js"))
  hostnames           = [var.github_repository]
  compatibility_flags = ["nodejs_compat_v2"]
  secrets = [
    { name = "SENTRY_DSN", value = module.sentry.dsn },
  ]
}

module "sentry" {
  source  = "app.terraform.io/okkema/project/sentry"
  version = "~> 0.4"

  github_repository = var.github_repository
}
