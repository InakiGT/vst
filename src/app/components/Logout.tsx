'use client'

import { logout } from '@/app/lib/actions'

export default function Logout() {
  return (
    <form action={logout}>
      <button type="submit" className="w-full text-left cursor-pointer">
        Cerrar sesión
      </button>
    </form>
  )
}
