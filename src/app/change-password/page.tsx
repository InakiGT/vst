'use client'

import Link from 'next/link'
import { Suspense, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { rubikglitch } from '@/fonts'
import { recoveryPassword } from '@/app/lib/actions'
import CredentialsFormContainer from '@/app/components/CredentialsFormContainer'

function LoginForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [ errorMessage, formAction, isPending ] = useActionState(recoveryPassword, undefined)

  return (
    <CredentialsFormContainer>
      <form action={ formAction } className="flex flex-col text-new-white bg-main-black items-center py-10 px-15 rounded-sm w-180 shadow-lg shadow-black/70">
        <div className="text-center mb-8">
          <h1 className={`${ rubikglitch.className } text-5xl`}>VST</h1>
          <h2 className="text-2xl font-light">Cambiar contraseña</h2>
          {
            errorMessage && (
              <p className='bg-red-400 font-bold px-20 py-2'>{ errorMessage }</p>
            )
          }
        </div>
        <div className="flex flex-col w-full gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-2xl" htmlFor="password">Nueva contraseña:</label>
            <input autoComplete="current-password" className="text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2" id="password" name="password" type="password" placeholder="Nueva contraseña" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-2xl" htmlFor="repeat-password">Repetir contraseña:</label>
            <input autoComplete="current-repeat-password" className="text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2" id="repeat-password" name="repeat-password" type="password" placeholder="Repetir contraseña" />
          </div>
          <input type="hidden" name="token" value={ token } />
        </div>
        <Link href='/login' className='text-left underline text-soft-white w-full'>Ir a inicio de sesión</Link>
        <div className="flex flex-col text-center pt-10 text-xl items-center gap-3 mt-10">
          <button aria-disabled={ isPending } className="cursor-pointer bg-main-blue font-bold text-3xl rounded-sm py-2 w-60">Actualizar contraseña</button>
        </div>
      </form>
    </CredentialsFormContainer>
  )
}


export default function Page() {
  return (
    <Suspense fallback={<div>Cargando login...</div>}>
      <LoginForm />
    </Suspense>
  )
}
