import { useState } from 'react'
import { type Coords } from '../lib/definitions'

export default function SearchMap(
  { setCoords, coords }: { setCoords: React.Dispatch<React.SetStateAction<Coords>>, coords: Coords }
) {
  const [ direccion, setDireccion ] = useState('')

  const buscar = async () => {
    const res = await fetch(`/api/geocode?address=${encodeURIComponent(direccion)}`)
    const data = await res.json()

    if (res.ok) {
      setCoords(data)
    } else {
      alert(data.error || 'Error al buscar coordenadas')
    }
  }


  return (
    <div className='w-full'>
      <div className='flex justify-between gap-2'>
        <input
          className="text-xl p-3 bg-soft-black rounded-sm border-b-borders border-b-2 w-full"
          type="text"
          placeholder="Escribe una dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <button type='button' className="font-bold text-xl bg-main-blue rounded-sm py-2 px-3 cursor-pointer w-25" onClick={buscar}>
          Buscar
        </button>
      </div>

      {coords && (
        <p className="my-2 text-soft-white text-sm">
          Latitud: { coords.lat }, Longitud: { coords.lng }
        </p>
      )}
    </div>
  )
}
