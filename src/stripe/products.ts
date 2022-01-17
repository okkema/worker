import Stripe from "stripe"
import Api from "./api"

type Products = {
  update: (product: Partial<Stripe.Product>) => Promise<Stripe.Product>
}

type ProductsInit = {
  secret: string
}

const Products = (init: ProductsInit): Products => {
  const { secret } = init
  const api = Api({ secret })
  const base = "https://api.stripe.com/v1/products"
  return {
    update: (product) => {
      const { id, ...rest } = product
      return api.fetch(`${base}/${id}`, "POST", rest)
    },
  }
}

export default Products
