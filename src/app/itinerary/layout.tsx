'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Logout from '@/app/components/Logout'

export default function ItineraryLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isSelected = (path: string) => {
    if ( pathname === path ) return 'bg-borders/50'
    return ''
  }

  return (
    <div className="bg-ultra-black h-svh flex gap-7 transition-all">
      <aside className={`transition-all duration-500 ${open ? "w-80" : "w-5"} bg-main-black py-20 relative`}>
        <nav className="h-full">
          <ul className={`${open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-100'} origin-left flex transition-all duration-300 flex-col text-xl`}>
            <li className={`px-5 py-3 cursor-pointer transition-colors hover:bg-borders/50 ${ isSelected('/itinerary') || isSelected('/itinerary/new-itinerary') }`}>
              <Link href="/itinerary">Itinerarios</Link>
            </li>
            <li className={`px-5 py-3 cursor-pointer transition-colors hover:bg-borders/50 ${ isSelected('/itinerary/my') }`}>
              <Link className='w-full' href="/itinerary/my">
                Mis itinerarios
              </Link>
            </li>
            <li className={`px-5 py-3 cursor-pointer transition-colors hover:bg-borders/50 ${ isSelected('/itinerary/profile') }`}>
              <Link href="/itinerary/profile">Modificar perfil</Link>
            </li>
            <li className={`px-5 py-3 cursor-pointer transition-colors hover:bg-borders/50 ${ isSelected('/itinerary/suggest') }`}>
              <Link className='w-full' href="/itinerary/suggestions">
                Quejas / Sugerencias
              </Link>
            </li>
            <li className={`px-5 py-3 cursor-pointer transition-colors hover:bg-red-400/20`}>
              <Logout />
            </li>
          </ul>

          <span
            onClick={() => setOpen(prev => !prev)}
            className="cursor-pointer absolute top-1/2 -right-6 bg-main-black w-20 h-20 flex items-center justify-end px-2 rounded-4xl transition-all duration-300"
          >
            <svg
              className={`w-6 h-6 text-new-white transition-transform duration-500 ${open ? "-scale-x-100" : "scale-x-100"}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
            </svg>
          </span>
        </nav>
      </aside>

      <main className="h-full py-10 px-20 flex flex-col justify-center gap-3 w-full">
        {children}
      </main>
    </div>
  )
}
