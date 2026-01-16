import { getProducts, getCategories } from "./actions"
import ProductsClient from "./products-client"

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const [productsResult, categoriesResult] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  const products = productsResult.products || []
  const categories = categoriesResult.categories || []

  return <ProductsClient products={products} categories={categories} />
}

