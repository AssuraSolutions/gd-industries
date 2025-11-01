"use client"

import { useState, useRef, DragEvent } from "react"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    value: string[]
    onChange: (urls: string[]) => void
    maxImages?: number
    minImages?: number
    disabled?: boolean
}

interface UploadState {
    uploading: boolean
    progress: number
}

export function ImageUpload({
    value = [],
    onChange,
    maxImages = 3,
    minImages = 1,
    disabled = false,
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploadState, setUploadState] = useState<UploadState>({ uploading: false, progress: 0 })
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith("image/")
        )

        if (files.length > 0) {
            await handleFiles(files)
        }
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            await handleFiles(files)
        }
    }

    const handleFiles = async (files: File[]) => {
        if (disabled || uploadState.uploading) return

        const remainingSlots = maxImages - value.length
        const filesToProcess = files.slice(0, remainingSlots)

        if (filesToProcess.length === 0) return

        setUploadState({ uploading: true, progress: 0 })

        try {
            const newUrls: string[] = []

            for (let i = 0; i < filesToProcess.length; i++) {
                const file = filesToProcess[i]
                const formData = new FormData()
                formData.append('file', file)

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) {
                    const error = await response.json()
                    console.error('Upload failed:', error)
                    continue
                }

                const data = await response.json()
                if (data.success && data.url) {
                    newUrls.push(data.url)
                }

                // Update progress
                const progress = Math.round(((i + 1) / filesToProcess.length) * 100)
                setUploadState({ uploading: true, progress })
            }

            if (newUrls.length > 0) {
                onChange([...value, ...newUrls])
            }
        } catch (error) {
            console.error('Upload error:', error)
        } finally {
            setUploadState({ uploading: false, progress: 0 })
        }
    }

    const handleRemove = (index: number) => {
        if (disabled) return
        const newUrls = value.filter((_, i) => i !== index)
        onChange(newUrls)
    }

    const handleClick = () => {
        if (!disabled && !uploadState.uploading) {
            fileInputRef.current?.click()
        }
    }

    const canAddMore = value.length < maxImages && !uploadState.uploading
    const hasMinimum = value.length >= minImages
    const isDisabled = disabled || uploadState.uploading

    return (
        <div className="space-y-4">
            {/* Preview Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {value.map((url, index) => (
                        <div key={index} className="relative aspect-square group">
                            <img
                                src={url}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border"
                            />
                            <button
                                onClick={() => handleRemove(index)}
                                disabled={isDisabled}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                type="button"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            {index === 0 && (
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    Primary
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {canAddMore && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClick}
                    className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                        isDragging
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-primary/50",
                        isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isDisabled}
                    />
                    <div className="flex flex-col items-center gap-2">
                        {value.length === 0 ? (
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        ) : (
                            <Upload className="h-8 w-8 text-muted-foreground" />
                        )}
                        <div>
                            <p className="text-sm font-medium">
                                {uploadState.uploading
                                    ? `Uploading... ${uploadState.progress}%`
                                    : value.length === 0
                                        ? "Upload product images"
                                        : "Add more images"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {uploadState.uploading
                                    ? "Please wait while images are uploading"
                                    : "Drag and drop or click to browse"}
                            </p>
                        </div>
                        {!uploadState.uploading && (
                            <p className="text-xs text-muted-foreground">
                                {value.length}/{maxImages} images • PNG, JPG up to 10MB
                            </p>
                        )}
                        {uploadState.uploading && (
                            <div className="w-full max-w-xs bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-primary h-full transition-all duration-300"
                                    style={{ width: `${uploadState.progress}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Validation Messages */}
            {!hasMinimum && (
                <p className="text-xs text-destructive">
                    Please upload at least {minImages} image{minImages > 1 ? "s" : ""}
                </p>
            )}
        </div>
    )
}
