'use client'

import { signOut } from 'next-auth/react'

export default function Logout() {
  return (
    <button
      onClick={async () => {
        await signOut({ callbackUrl: '/vst/login' })
      }}
      className="w-full text-left cursor-pointer"
    >
      Salir
    </button>
  )
}
