'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { type Coords } from '../lib/definitions'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN! || ''

export default function Map({ start }: { start: Coords }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (map.current) return

    const end = {
      lng: -99.2826866,
      lat: 19.3517598,
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: start,
      zoom: 14,
    })

    map.current.on('load', () => {
      fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
      .then((res) => res.json())
        .then((data) => {
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0].geometry

            map.current!.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: route,
              },
            })

            map.current!.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#4d90fe',
                'line-width': 5,
              },
            })

            // Enfoca la vista a la ruta con un padding para asegurar que los marcadores sean visibles
            const bounds = new mapboxgl.LngLatBounds()
            route.coordinates.forEach((coord: [number, number]) => {
              bounds.extend(coord)
            })
            map.current!.fitBounds(bounds, { padding: { top: 60, bottom: 60, left: 60, right: 60 } })
          }
        })
        .catch((error) => {
          console.error('Error fetching or displaying route:', error)
        })
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [ start ])

  return <div ref={mapContainer} className="w-full h-10/12" />
}
