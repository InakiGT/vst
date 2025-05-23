'use client'

import { rubikglitch } from '@/fonts'
import Link from 'next/link'
import CredentialsFormContainer from '@/app/components/CredentialsFormContainer'
import { useActionState } from 'react'
import { authenticate } from '@/app/lib/actions'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/itinerary'
  const [ errorMessage, formAction, isPending ] = useActionState(authenticate, undefined)

  return (
    <CredentialsFormContainer>
      <form action={ formAction } className="flex flex-col text-new-white bg-main-black items-center py-10 px-15 rounded-sm w-180 shadow-lg shadow-black/70">
        <div className="text-center mb-8">
          <h1 className={`${ rubikglitch.className } text-5xl`}>VST</h1>
          <h2 className="text-2xl font-light">Inicio de Sesión</h2>
          {
            errorMessage && (
              <p className='bg-red-400 font-bold px-20 py-2'>{ errorMessage }</p>
            )
          }
        </div>
        <div className="flex flex-col w-full gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-2xl" htmlFor="email">Correo:</label>
            <input autoComplete="current-email" className="text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2" id="email" name="email" type="email" placeholder="cua@cua.uam.mx" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-2xl" htmlFor="password">Contraseña:</label>
            <input autoComplete="current-password" className="text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2" id="password" name="password" type="password" placeholder="Contraseña" />
          </div>
        </div>

        <div className="flex flex-col text-center pt-10 text-xl items-center gap-3 mt-10">
          <input type="hidden" name='redirectTo' value={ callbackUrl } />
          <button aria-disabled={ isPending } className="cursor-pointer bg-main-blue font-bold text-3xl rounded-sm py-2 w-60">Iniciar Sesión</button>
          <span className="font-bold">o</span>
          <Link className="text-soft-white mb-6" href={ '/register' }>¿No tienes una cuenta? <span className="underline">Registrate</span></Link>
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
