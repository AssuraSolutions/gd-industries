import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'File size must be less than 10MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename with timestamp
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s+/g, '-') // Replace spaces with hyphens
    const fileName = `${timestamp}-${originalName}`

    let uploadsDir: string
    let publicUrl: string

    if (isServerless) {
      uploadsDir = join('/tmp', 'uploads')
      publicUrl = `/uploads/${fileName}`
    } else {
      uploadsDir = join(process.cwd(), 'public', 'uploads')
      publicUrl = `/uploads/${fileName}`
    }

    // Ensure uploads directory exists
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      ...(isServerless && { 
        warning: 'File uploaded to temporary storage. Consider using cloud storage for production.' 
      })
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload file' 
    }, { status: 500 })
  }
}
