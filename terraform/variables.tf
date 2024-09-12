variable "github_repository" {}
variable "cloudflare_account_id" {}
variable "cloudflare_zone_id" {}

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