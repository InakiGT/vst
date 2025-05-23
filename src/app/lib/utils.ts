  export async function reverseGeocode(lat: number, lon: number, get: 'name' | 'display_name' = 'display_name') {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'vst (inaki.garcia@cua.uam.com)'
        }
      }
    )

    if (!res.ok) throw new Error('Failed to fetch location')

    const data = await res.json()
    return data[get]
  }
