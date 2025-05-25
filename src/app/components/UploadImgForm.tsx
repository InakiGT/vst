'use client'

import Image from 'next/image'
import { useState } from 'react'
import { addKardexImgToUser } from '@/app/lib/actions'

export default function UploadImgForm({ kardexImg }: { kardexImg:  string | undefined }) {
  const [ file, setFile ] = useState<File | null>(null)
  const [ message, setMessage ] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    setMessage(data.message)
    await addKardexImgToUser(undefined, data.path)
  }


  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <h3 className="text-xl font-bold">Sube la imagen de tu kardex <span className='text-sm font-light'>(El archivo no debe contener especios ni caracteres especiales)</span></h3>
      <span className='font-light mb-4'>La imagen es necesaria para validar tu identidad</span>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-white cursor-pointer"
      />
      <button type="submit" className="bg-main-blue font-bold text-xl rounded-sm py-2 w-60 my-5 cursor-pointer">Subir imagen</button>
      {message && <p>{message}</p>}
      { kardexImg && <Image className='rounded-sm mx-auto my-0' width={ 500 } height={ 600 } src={ kardexImg } alt="Imagen del karedex" /> }
    </form>
  )
}
