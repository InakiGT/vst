'use client'

import Map from '@/app/components/Map'
import SearchMap from '@/app/components/SearchMap'
import { updateItinerary } from '@/app/lib/actions'
import type { ItineraryFromDb, Coords, UserEnrolled } from '@/app/lib/definitions'
import { doto } from '@/fonts'
import { useActionState, useState } from 'react'
import UsersEnrolled from './UsersEnrolled'

export default function UpdateItineraryForm({ itinerary, users } : { itinerary: ItineraryFromDb, users: UserEnrolled[] | undefined }) {

  const [ coords, setCoords ] = useState<Coords>({ lat: itinerary.location.y, lng: itinerary.location.x })
  const [ state, formAction, isPending ] = useActionState(updateItinerary, undefined)

  return (
    <section className="bg-main-black rounded-sm h-10/12 shadow-lg shadow-black grid grid-cols-2">
      <aside className="px-20 py-12 h-full border-r-borders border-r-1 overflow-auto ">
        <h2 className="text-3xl font-bold">Acepta las solitudes de viaje</h2>
        <UsersEnrolled users={ users } itineraryId={ itinerary.id } />

        <h2 className="text-3xl font-bold">Actualiza tu itinerario</h2>
        <form action={ formAction } className="mt-5 flex flex-col items-center w-full gap-5 h-10/12 overflow-y-scroll">
          <input type="number" name="id" hidden defaultValue={ itinerary.id } />
          <div className="flex flex-col gap-2 text-2xl w-full">
            <label className='cursor-pointer' htmlFor="plate">Número de placa:</label>
            <input defaultValue={ itinerary.plate } name="plate" id="plate" autoComplete='current-plate' className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state?.errors?.plate ? 'border-b-red-400' : '' } transition-colors duration-600`} type="text" placeholder="ACB1290D" />
          </div>
          <div className="flex flex-col gap-2 text-2xl w-full">
            <label className='cursor-pointer' htmlFor="color">Color del vehículo:</label>
            <input defaultValue={ itinerary.color } name='color' id="color" autoComplete='current-color' className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state?.errors?.color ? 'border-b-red-400' : '' } transition-colors duration-600`} type="text" placeholder="Naranja" />
          </div>
          <div className="flex flex-col gap-2 text-2xl w-full">
            <label className='cursor-pointer' htmlFor="location" >Zona:</label>
            <SearchMap setCoords={ setCoords } coords={ coords } />
            <input hidden onChange={ () => {} } value={ JSON.stringify(coords) } name='location' id="location" autoComplete='current-location' type="text"/>
          </div>
          <div className="flex flex-col gap-2 text-2xl w-full">
            <label className='cursor-pointer' htmlFor="direction">Sentido:</label>
            <p className='text-sm font-light'>Actual seleccionado: { itinerary.direction }</p>
            <select defaultValue={ itinerary.direction } name="direction" id="direction" className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state?.errors?.direction ? 'border-b-red-400' : '' } transition-colors duration-600`}>
              <option value="uam">Hacia UAM</option>
              <option value="location">Hacia Zona</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 text-2xl w-full">
            <span className='cursor-pointer'>Periodicidad:</span>
            <span className='text-sm text-red-400 text-center'>{ state?.errors?.days }</span>
            <div className={`flex gap-2 ${ doto.className } text-5xl`}>
              <div>
                <input hidden id="l" name="l" defaultChecked={ itinerary.days.includes('l') } type="checkbox" className='peer' />
                <label className="cursor-pointer transition-transform hover:scale-110 peer-checked:text-green-600 peer-checked:scale-110" htmlFor="l">L</label>
              </div>

              <div>
                <input hidden id="ma" name='ma' defaultChecked={ itinerary.days.includes('ma') } type="checkbox" className='peer' />
                <label className="cursor-pointer transition-transform hover:scale-110 peer-checked:text-green-600 peer-checked:scale-110" htmlFor="ma">M</label>
              </div>

              <div>
                <input hidden id="mi" name='mi' defaultChecked={ itinerary.days.includes('mi') } type="checkbox" className='peer' />
                <label className="cursor-pointer transition-transform hover:scale-110 peer-checked:text-green-600 peer-checked:scale-110" htmlFor="mi">M</label>
              </div>

              <div>
                <input hidden id="j" name='j' defaultChecked={ itinerary.days.includes('j') } type="checkbox" className='peer' />
                <label className="cursor-pointer transition-transform hover:scale-110 peer-checked:text-green-600 peer-checked:scale-110" htmlFor="j">J</label>
              </div>

              <div>
                <input hidden id="v" name='v' defaultChecked={ itinerary.days.includes('v') } type="checkbox" className='peer' />
                <label className="cursor-pointer transition-transform hover:scale-110 peer-checked:text-green-600 peer-checked:scale-110" htmlFor="v">V</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-2xl w-full">
            <label className='cursor-pointer' htmlFor="hour">Hora en UAM:</label>
            <input defaultValue={ itinerary.hour } name='hour' id="hour" autoComplete='current-hour' className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state?.errors?.hour ? 'border-b-red-400' : '' } transition-colors duration-600`} type="time" />
          </div>
          <div className="flex flex-col gap-2 text-2xl w-full">
            <label className='cursor-pointer' htmlFor="capacity">Cupo actual:</label>
            <input defaultValue={ itinerary.capacity } name='capacity' id="capacity" autoComplete='current-capacity' className={`text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 ${ state?.errors?.capacity ? 'border-b-red-400' : '' } transition-colors duration-600`} type="number" min="1" max="5" />
          </div>

          <button type='submit' className="font-bold text-xl bg-main-blue rounded-sm py-2 px-5 cursor-pointer w-60">Actualizar Itinerario</button>
          { isPending && <p>Cargando</p> }
        </form>
      </aside>
      <aside className="px-20 py-12 h-full flex items-center justify-center">
        <Map start={ coords } />
      </aside>
    </section>
  )
}
