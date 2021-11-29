import Api from "./api"

type Pages = {
  deploy: (project: string) => Promise<boolean>
}

type PagesInit = {
  email: string
  key: string
  account: string
}

const Pages = (init: PagesInit): Pages => {
  const { email, key, account } = init
  const api = Api({ email, key })
  const base = `https://api.cloudflare.com/client/v4/accounts/${account}/pages`
  return {
    deploy: (project) =>
      api.fetch(`${base}/projects/${project}/deployments`, "POST"),
  }
}

export default Pages
