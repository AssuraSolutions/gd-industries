import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { ActiveFilterBadges } from './active-filter-badges'
import type { SortOption, PriceRange } from '@/hooks/use-product-filtering'

interface ProductFiltersProps {
    searchQuery: string
    onSearchChange: (value: string) => void
    sortBy: SortOption
    onSortChange: (value: SortOption) => void
    onClearFilters: () => void
    showCategoryFilter?: boolean
    categoryId?: string
    onCategoryChange?: (value: string) => void
    categories?: Array<{ id: string; name: string }>
}

export function ProductFilters({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    onClearFilters,
    showCategoryFilter = false,
    categoryId,
    onCategoryChange,
    categories = [],
}: ProductFiltersProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className={`grid grid-cols-1 gap-4 mb-4 ${showCategoryFilter ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Category Filter (optional) */}
                {showCategoryFilter && (
                    <Select value={categoryId} onValueChange={onCategoryChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {/* Sort */}
                <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name A-Z</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Active Filters */}
            <ActiveFilterBadges
                searchQuery={searchQuery}
                onClearSearch={() => onSearchChange('')}
                onClearAll={onClearFilters}
            />
        </div>
    )
}
