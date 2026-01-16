import { getCategories } from "./actions"
import CategoriesClient from "./categories-client"

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
    const categoriesResult = await getCategories()

    const categories = categoriesResult.categories || []

    return <CategoriesClient categories={categories} />
}
