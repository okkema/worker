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
  version = "0.2.1"

  repository = var.github_repository
  key        = each.key
  value      = each.value
}

module "bucket" {
  source  = "app.terraform.io/okkema/bucket/cloudflare"
  version = "0.1.1"

  account_id = var.cloudflare_account_id
  access_key = var.cloudflare_r2_access_key
  secret_key = var.cloudflare_r2_secret_key
  bucket     = var.github_repository
}

module "worker" {
  source     = "app.terraform.io/okkema/worker/cloudflare"
  version    = "0.4.0"
  depends_on = [module.bucket]

  account_id = var.cloudflare_account_id
  zone_id    = var.cloudflare_zone_id
  name       = var.github_repository
  content    = file(abspath("${path.module}/../example/dist/index.js"))
  hostnames  = [var.github_repository]
  buckets = [{
    binding = "BUCKET"
    name    = var.github_repository
  }]
}
