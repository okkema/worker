variable "github_repository" {}
variable "cloudflare_account_id" {}
variable "cloudflare_zone_id" {}
variable "cloudflare_r2_access_key" {
  sensitive = true
}
variable "cloudflare_r2_secret_key" {
  sensitive = true
}

# GitHub Actions Secrets
variable "TF_API_TOKEN" {
  sensitive = true
}
variable "ACTIONS_GITHUB_TOKEN" {
  sensitive = true
}
variable "NPM_TOKEN" {
  sensitive = true
}