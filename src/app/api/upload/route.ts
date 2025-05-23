import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { mkdir } from 'fs'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ message: 'No file provided' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

  // Crear la carpeta si no existe
  mkdir(uploadsDir, { recursive: true }, () => {})

  const filename = `${Date.now()}-${file.name}`
  const filepath = path.join(uploadsDir, filename)

  await writeFile(filepath, buffer)

  return NextResponse.json({ message: 'Archivo subido exitosamente', path: `/vst/uploads/${filename}` })
}
