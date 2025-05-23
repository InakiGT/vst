// app/api/geocode/route.ts
import { NextRequest, NextResponse } from 'next/server'
import opencage from 'opencage-api-client'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Dirección inválida' }, { status: 400 })
  }

  try {
    const data = await opencage.geocode({
      key: process.env.OPENCAGE_API_KEY! || 'pacohertz',
      q: address,
      language: 'es',
      countrycode: 'MX',
      limit: 5,
    })

    if (data.results.length === 0) {
      return NextResponse.json({ error: 'No se encontraron resultados' }, { status: 404 })
    }

    const { lat, lng } = data.results[0].geometry
    return NextResponse.json({ lat, lng })
  } catch (error) {
    console.error('Error en OpenCage:', error)
    return NextResponse.json({ error: 'Error al geocodificar' }, { status: 500 })
  }
}
