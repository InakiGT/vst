import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  const body = await req.json()
  const { to, subject, text } = body

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'inaki.garcia@cua.uam.mx',
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const info = await transporter.sendMail({
      from: '"VST Itinerarios" <inaki.garcia@cua.uam.mx>',
      to,
      subject,
      text,
    })



    return NextResponse.json({ success: true, info })
  } catch (error) {
    console.error('Error al enviar correo:', error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
