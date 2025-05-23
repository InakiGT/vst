'use client'

import SearchMap from '@/app/components/SearchMap'
import { doto } from '@/fonts'
import { useActionState, useState } from 'react'
import Map from '@/app/components/Map'
import { createItinerary } from '@/app/lib/actions'
import { type Coords } from '@/app/lib/definitions'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function NewItineraryForm() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const [ coords, setCoords ] = useState<Coords>({ lat: 19.3517598, lng: -99.2826866 })
  const [ state, formAction, isPending ] = useActionState(createItinerary, undefined)

  const handleSearch = (name: string, term: string) => {
    const params = new URLSearchParams(searchParams)

    if ( term ) {
      params.set(name, term)
    } else {
      params.delete(name)
    }

    replace(`${ pathname }?${ params.toString() }`)
  }

  return (
  <>
    <aside className="px-20 py-12 h-full border-r-borders border-r-1 overflow-auto ">
      <h2 className="text-3xl font-bold">Crea tu itinerario</h2>
      <form action={ formAction } className="mt-5 flex flex-col items-center w-full gap-5 h-10/12 overflow-y-scroll">
        <div className="flex flex-col gap-2 text-2xl w-full">
          <label className='cursor-pointer' htmlFor="plate">Número de placa:</label>
          <input onChange={ e => handleSearch('plate', e.target.value) } defaultValue={ searchParams.get('plate')?.toString() } name="plate" id="plate" autoComplete='current-plate' className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state?.errors?.plate ? 'border-b-red-400' : '' } transition-colors duration-600`} type="text" placeholder="ACB1290D" />
        </div>
        <div className="flex flex-col gap-2 text-2xl w-full">
          <label className='cursor-pointer' htmlFor="color">Color del vehículo:</label>
          <input onChange={ e => handleSearch('color', e.target.value) } defaultValue={ searchParams.get('color')?.toString() } name='color' id="color" autoComplete='current-color' className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state?.errors?.color ? 'border-b-red-400' : '' } transition-colors duration-600`} type="text" placeholder="Naranja" />
        </div>
        <div className="flex flex-col gap-2 text-2xl w-full">
          <label className='cursor-pointer' htmlFor="location" >Zona:</label>
          <SearchMap setCoords={ setCoords } coords={ coords } />
          <input hidden onChange={ () => {} } value={ JSON.stringify(coords) } name='location' id="location" autoComplete='current-location' type="text"/>
        </div>
        <div className="flex flex-col gap-2 text-2xl w-full">
          <label className='cursor-pointer' htmlFor="direction">Sentido:</label>
          <select name="direction" id="direction" className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state?.errors?.direction ? 'border-b-red-400' : '' } transition-colors duration-600`}>
            <option value="uam">Hacia UAM</option>
            <option value="location">Hacia Zona</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 text-2xl w-full">
          <span className='cursor-pointer'>Periodicidad:</span>
          <span className='text-sm text-red-400 text-center'>{ state?.errors?.days }</span>
          <div className={`flex gap-2 ${ doto.className } text-5xl`}>
            <div>
              <input hidden id="l" name="l" type="checkbox" className='peer' />
              <label className="cursor-pointer transition-transform hover:scale-110 peer-checked:text-green-600 peer-checked:scale-110" htmlFor="l">L</label>
            </div>

            <div>
              <input hidden id="ma" name='ma' type="checkbox" className='peer' />
              <label className="cursor-pointer transition-transform hover:scale-110 peer-checked:text-green-600 peer-checked:scale-110" htmlFor="ma">M</label>
            </div>

            <div>
              <input hidden id="mi" name='mi' type="checkbox" className='peer' />
              <label className="cursor-pointer transition-transform hover:scale-110 peer-checked:text-green-600 peer-checked:scale-110" htmlFor="mi">M</label>
            </div>

            <div>
              <input hidden id="j" name='j' type="checkbox" className='peer' />
              <label className="cursor-pointer transition-transform hover:scale-110 peer-checked:text-green-600 peer-checked:scale-110" htmlFor="j">J</label>
            </div>

            <div>
              <input hidden id="v" name='v' type="checkbox" className='peer' />
              <label className="cursor-pointer transition-transform hover:scale-110 peer-checked:text-green-600 peer-checked:scale-110" htmlFor="v">V</label>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-2xl w-full">
          <label className='cursor-pointer' htmlFor="hour">Hora en UAM:</label>
          <input onChange={ e => handleSearch('hour', e.target.value) } defaultValue={ searchParams.get('hour')?.toString() } name='hour' id="hour" autoComplete='current-hour' className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state?.errors?.hour ? 'border-b-red-400' : '' } transition-colors duration-600`} type="time" />
        </div>
        <div className="flex flex-col gap-2 text-2xl w-full">
          <label className='cursor-pointer' htmlFor="capacity">Cupo actual:</label>
          <input onChange={ e => handleSearch('capacity', e.target.value) } defaultValue={ searchParams.get('capacity')?.toString() }name='capacity' id="capacity" autoComplete='current-capacity' className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state?.errors?.capacity ? 'border-b-red-400' : '' } transition-colors duration-600`} type="number" min="1" max="5" />
        </div>

        <button type='submit' className="font-bold text-2xl bg-main-blue rounded-sm py-2 px-5 cursor-pointer w-60">Crear Itinerario</button>
        { isPending && <p>Cargando</p> }
      </form>
    </aside>
    <aside className="px-20 py-12 h-full flex items-center justify-center">
      <Map start={ coords } />
    </aside>
  </>
  )
}
