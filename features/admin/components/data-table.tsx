/**
 * Admin DataTable component - Generic table with sorting and pagination
 */

import React, { memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TableColumn } from '../types'

interface DataTableProps<T> {
    title?: string
    description?: string
    data: T[]
    columns: TableColumn<T>[]
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
    sortKey?: keyof T | null
    sortOrder?: 'asc' | 'desc'
    onSort?: (key: keyof T) => void
    onPageChange: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
    loading?: boolean
    emptyMessage?: string
}

/**
 * Reusable data table component for admin
 */
export const DataTable = memo(<T extends Record<string, any>>({
    title,
    description,
    data,
    columns,
    page,
    pageSize,
    totalPages,
    totalItems,
    sortKey,
    sortOrder,
    onSort,
    onPageChange,
    // onPageSizeChange, // Removed because it's unused
    loading = false,
    emptyMessage = 'No data available',
}: DataTableProps<T>) => {
    const renderCell = (item: T, column: TableColumn<T>) => {
        if (column.render) {
            return column.render(item[column.key as keyof T], item)
        }
        return String(item[column.key as keyof T] || '-')
    }

    return (
        <Card>
            {(title || description) && (
                <CardHeader>
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            )}
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableHead
                                        key={String(column.key)}
                                        style={{ width: column.width }}
                                        className={cn(column.sortable && 'cursor-pointer select-none')}
                                        onClick={() => column.sortable && onSort?.(column.key as keyof T)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {column.header}
                                            {column.sortable && sortKey === column.key && (
                                                <ArrowUpDown className={cn(
                                                    'h-4 w-4',
                                                    sortOrder === 'asc' ? 'rotate-180' : ''
                                                )} />
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-8">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((item, index) => (
                                    <TableRow key={index}>
                                        {columns.map((column) => (
                                            <TableCell key={String(column.key)}>
                                                {renderCell(item, column)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalItems)} of{' '}
                            {totalItems} results
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onPageChange(1)}
                                disabled={page === 1}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onPageChange(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onPageChange(page + 1)}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onPageChange(totalPages)}
                                disabled={page === totalPages}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}) as <T extends Record<string, any>>(props: DataTableProps<T>) => JSX.Element

;(DataTable as any).displayName = 'DataTable'
