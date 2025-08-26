'use client'

import CredentialsFormContainer from '@/app/components/CredentialsFormContainer'
import { rubikglitch } from '@/fonts'
import Link from 'next/link'
import { useActionState } from 'react'
import { generateRecoveryToken } from '@/app/lib/actions'

export default function Page() {
  const [ errorMessage, formAction, isPending ] = useActionState(generateRecoveryToken, undefined)

  return (
    <CredentialsFormContainer>
      <form action={ formAction } className="flex flex-col text-new-white bg-main-black items-center py-10 px-15 rounded-sm w-180 shadow-lg shadow-black/70">
        <div className="text-center mb-8">
          <h1 className={`${ rubikglitch.className } text-5xl`}>VST</h1>
          <h2 className="text-2xl font-light">Recuperación de cuenta</h2>
          {
            errorMessage && (
              <p className='bg-red-400 font-bold px-20 py-2'>{ errorMessage }</p>
            )
          }
        </div>
        <div className="flex flex-col w-full gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-2xl" htmlFor="email">Correo registrado:</label>
            <input autoComplete="current-email" className="text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2" id="email" name="email" type="email" placeholder="cua@cua.uam.mx" />
          </div>
        </div>
        <Link href='/login' className='text-left underline text-soft-white w-full'>Ir a inicio de sesión</Link>
        <div className="flex flex-col text-center pt-10 text-xl items-center gap-3 mt-10">
          <button aria-disabled={ isPending } className="cursor-pointer bg-main-blue font-bold text-3xl rounded-sm py-2 w-60">Solicitar correo</button>
        </div>
      </form>
    </CredentialsFormContainer>
  )
}
