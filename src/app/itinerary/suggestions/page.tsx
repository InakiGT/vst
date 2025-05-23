'use client'

import Backward from '@/app/components/Backward'
import { FormEvent, useEffect, useState } from 'react'

export default function Page() {
  const [ error, setError ] = useState('')
  const [ msg, setMsg ] = useState('')

  const sendEmail = async  (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const text = formData.get('text')

    if ( !text ) {
      setError('VOID')
      return
    }


    const data = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: process.env.NEXT_PUBLIC_TO_SUGGESTIONS_EMAIL,
        subject: 'Queja o sugerencia en VST',
        text: `${ text }`
      })
    })

    if ( !data.ok ) {
      setError('POST ERROR')
      return
    }

    setError('')
    setMsg('OK')
  }

  useEffect(() => {
    if (!msg) return

    const timeout = setTimeout(() => {
      setMsg('')
    }, 4000)

    return () => clearTimeout(timeout)
  }, [msg])

  return (
    <>
      <Backward title="Quejas y sugerencias / Manda un mensaje" />
      <section className="bg-main-black rounded-sm h-10/12 shadow-lg shadow-black px-20 py-15 overflow-y-scroll flex flex-col justify-center">
        <h3 className="text-2xl font-bold mb-3 w-full">Escribe tu queja o sugerencia</h3>
        {
          error &&
          <span className='bg-red-400 px-2 py-1 text-center font-bold my-2 rounded-sm text-lg'>{ error  === 'VOID' ? 'El mensaje no puede ir vacío' : 'Error al intentar enviar el mensaje, favor de intenrarlo de nuevo más tarde'  }</span>
        }
        {
          msg &&
          <span className='bg-green-600 px-2 py-1 text-center font-bold my-2 rounded-sm text-lg'>El mensaje ha sido enviado correctamente</span>
        }
        <form className="w-full flex flex-col justify-center items-center" onSubmit={ sendEmail }>
          <div className="flex flex-col w-full">
          <label className="text-xl" htmlFor="">Mensaje:</label>
          <textarea name="text" id="text" className="text-lg p-3 bg-soft-black rounded-sm border-b-borders border-b-2 h-50 mt-2">
          </textarea>
          </div>
          <button type="submit" className="bg-main-blue font-bold text-xl rounded-sm py-2 w-60 mt-10 cursor-pointer">Enviar mensaje</button>
        </form>
      </section>
    </>
  )
}
