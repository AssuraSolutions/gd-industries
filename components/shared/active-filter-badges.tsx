import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ActiveFilterBadgesProps {
    searchQuery: string
    onClearSearch: () => void
    onClearAll: () => void
}

export function ActiveFilterBadges({
    searchQuery,
    onClearSearch,
    onClearAll,
}: ActiveFilterBadgesProps) {
    const hasActiveFilters = searchQuery !== ''

    if (!hasActiveFilters) return null

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={onClearSearch}>
                    Search: {searchQuery}
                    <X className="h-3 w-3" />
                </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={onClearAll}>
                Clear all
            </Button>
        </div>
    )
}
