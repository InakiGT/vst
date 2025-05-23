'use client'

import { enrollToItinerary, unenrollFromItinerary } from '../lib/actions'

export default function EnrollButtons({ itineraryId, quantity, active, enrolled }: { itineraryId: string, quantity: number, active: string, enrolled: boolean }) {
  return (
    <>
      {
        enrolled ? (
          <button
            onClick={ () => unenrollFromItinerary(undefined, itineraryId) }
            className={`font-bold bg-main-blue rounded-sm py-1 px-8 ${ quantity < 1 && active === 'a'  ? 'bg-main-blue/40 text-white/40 cursor-normal' : 'bg-main-blue text-white cursor-pointer' }`}
            disabled={ quantity < 1 || active !== 'a' }
          >
          Desincribirse
        </button>
        ) : (
        <button
          onClick={ () => enrollToItinerary(undefined, itineraryId) }
          className={`font-bold bg-main-blue rounded-sm py-1 px-8 ${ quantity < 1 && active === 'a'  ? 'bg-main-blue/40 text-white/40 cursor-normal' : 'bg-main-blue text-white cursor-pointer' }`}
          disabled={ quantity < 1 || active !== 'a' }
          >
          Unirse
        </button>
        )
      }
    </>
  )
}
