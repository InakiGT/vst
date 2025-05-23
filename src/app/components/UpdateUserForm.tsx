'use client'

import { User } from '@/app/lib/definitions'
import { useActionState } from 'react'
import { updateUser, UserState } from '@/app/lib/actions'

export default function UpdateUserForm({ user } : { user: User | undefined }) {

  const initialState: UserState = { message: null, errors: {} }
  const [ , formAction ] = useActionState(updateUser, initialState)

  return (
    <form className="flex flex-col items-center justify-center" action={ formAction }>
    <div className="flex flex-col w-full gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-xl" htmlFor="name">Nombre:</label>
        <input defaultValue={ user?.name } autoComplete="current-name" className="text-lg p-3 bg-soft-black rounded-sm border-b-borders border-b-2" id="name" name="name" type="text" placeholder="John" />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label className="text-xl" htmlFor="last-name">Apellidos:</label>
        <input defaultValue={ user?.lastname } autoComplete="current-last-name" className="text-lg p-3 bg-soft-black rounded-sm border-b-borders border-b-2" id="last-name" name="lastname" type="text" placeholder="Doe Doe" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xl" htmlFor="email">Correo:</label>
        <input defaultValue={ user?.email } autoComplete="current-email" className="text-lg p-3 bg-soft-black rounded-sm border-b-borders border-b-2" id="email" name="email" type="email" placeholder="cua@cua.uam.mx" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xl" htmlFor="password">Contraseña <span className='text-light text-sm'>(Si lo dejas en blanco conservaras tu antigua contraseña)</span>:</label>
        <input autoComplete="current-password" className="text-lg p-3 bg-soft-black rounded-sm border-b-borders border-b-2" id="password" name="password" type="password" placeholder="Contraseña" />
      </div>
    </div>


    <button className="bg-main-blue font-bold text-xl rounded-sm py-2 w-60 my-5 cursor-pointer">Actualizar</button>
  </form>
  )
}
