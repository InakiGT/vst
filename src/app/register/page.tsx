'use client'

import { rubikglitch } from '@/fonts'
import CredentialsFormContainer from '../components/CredentialsFormContainer'
import Link from 'next/link'
import { useActionState } from 'react'
import { createUser, type UserState } from '../lib/actions'

export default function Page() {
  const initialState: UserState = { message: null, errors: {} }
  const [ state, formAction ] = useActionState(createUser, initialState)

  return (
    <CredentialsFormContainer>
      <form action={ formAction } className="flex flex-col text-new-white bg-main-black items-center py-10 px-15 rounded-sm w-180 shadow-lg shadow-black/70">
        <div className="text-center mb-8">
          <h1 className={`${ rubikglitch.className } text-5xl`}>VST</h1>
          <h2 className="text-2xl font-light mb-1">Registro</h2>
          {
            state.message &&
            <span className='bg-red-400 py-1 px-5 text-center font-bold rounded-sm'>{ state.message }</span>
          }
        </div>
        <div className="flex flex-col w-full gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-2xl" htmlFor="name">Nombre:</label>
            <input autoComplete="current-name" className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state.errors?.name ? 'border-b-red-400' : '' } transition-colors duration-600`} id="name" name="name" type="text" placeholder="John" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-2xl" htmlFor="lastname">Apellidos:</label>
            <input autoComplete="current-lastname" className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state.errors?.lastname ? 'border-b-red-400' : '' } transition-colors duration-600`} id="lastname" name="lastname" type="text" placeholder="Doe Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-2xl" htmlFor="email">Correo:</label>
            <input autoComplete="current-email" className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state.errors?.email ? 'border-b-red-400' : '' } transition-colors duration-600`} id="email" name="email" type="email" placeholder="cua@cua.uam.mx" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-2xl" htmlFor="password">Contraseña:</label>
            <input autoComplete="current-password" className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state.errors?.password ? 'border-b-red-400' : '' } transition-colors duration-600`} id="password" name="password" type="password" placeholder="Contraseña" />
          </div>
        </div>

        <div className="flex flex-col text-center pt-10 text-xl items-center gap-3 mt-1">
          <button className="bg-main-blue font-bold text-3xl rounded-sm py-2 w-60 cursor-pointer">Registrarse</button>
          <span className="font-bold">o</span>
          <Link className="text-soft-white mb-6" href={ '/login' }>¿Ya tienes una cuenta? <span className="underline">Inicia Sesión</span></Link>
        </div>
      </form>
    </CredentialsFormContainer>
  )
}
