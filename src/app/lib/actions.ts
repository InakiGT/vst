'use server'

import mysql from 'mysql2/promise'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { AuthError } from 'next-auth'
import { auth, signIn, signOut } from '@/auth'
import { revalidatePath } from 'next/cache'
import { fetchUserByEmail } from './data'

const sql = await mysql.createConnection(process.env.MYSQL_URI || '')

const CreateUserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  lastname: z.string().min(1, { message: 'El apellido es requerido' }),
  email: z.string().email({ message: 'Correo no válido' }),
  password: z.string().min(5, { message: 'La contraseña debe tener al menos 5 caracteres' }),
  kardex_photo: z.string().url(),
})

const CreateItinerarySchema = z.object({
  id: z.string(),
  plate: z.string().min(1, { message: 'La placa es requerida' }),
  color: z.string(),
  location: z.string().min(1, { message: 'La locación origen es requerida' }),
  direction: z.string().min(1, { message: 'La dirección del viaje es requerida' }),
  hour: z.string().min(1, { message: 'El horario del viaje es requerido' }),
  capacity: z.string().min(1, { message: 'La capacidad dek viaje es requerida' }),
  days: z.string().min(1, { message: 'Debes seleccionar al menos un día para la periodicidad' }),
  email: z.string().email({ message: 'No tienes una sesión iniciada' }),
})

const UpdateUserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  lastname: z.string().min(1, { message: 'El apellido es requerido' }),
  email: z.string().email({ message: 'Correo no válido' }),
  password: z.string(),
  kardex_photo: z.string().url(),
})

const CreateUserFormSchema = CreateUserSchema.omit({
  id: true,
  kardex_photo: true,
})

const UpdateUserFormSchema = UpdateUserSchema.omit({
  id: true,
  kardex_photo: true,
})

const CreateItineraryFormSchema = CreateItinerarySchema.omit({
  id: true,
})

const UpdateItineraryFormSchema = CreateItinerarySchema

export type UserState = {
  errors?: {
    name?: string[]
    lastname?: string[]
    email?: string[]
    password?: string[]
  }
  message?: string | null
}

export type ItineraryState = {
  errors?: {
    plate?: string[]
    color?: string[]
    location?: string[]
    direction?: string[]
    hour?: string[]
    capacity?: string[]
    days?: string[]
  }
  message?: string | null
}

export async function createUser(prevState: UserState, formData: FormData) {
  const validatedFields = CreateUserFormSchema.safeParse({
    name: formData.get('name'),
    lastname: formData.get('lastname'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if ( !validatedFields.success ) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Error al crear usuario',
    }
  }

  const { name, lastname, email, password } = validatedFields.data
  const encryptedPassword = await bcrypt.hash(password, 10)

  try {
    await sql.execute(
      `INSERT INTO users (name, lastname, email, password) VALUES (?, ?, ?, ?)`,
      [name, lastname, email, encryptedPassword]
    )

    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Alta en VST',
        text: `Te has dado de alta en VST, ahora puedes crear un itinerario o inscribirte a uno, pero no olvides antes subir una foto de tu kardex para validar tu identidad`
      })
    })

    redirect('/login')
  } catch ( err ) {
    console.error(err)
    return {
      errors: {},
      message: 'El usuario ya se encuentra inscrito, prueba iniciar sesión'
    }
  }

}

export async function updateUser(prevState: UserState, formData: FormData) {
  const validatedFields = UpdateUserFormSchema.safeParse({
    name: formData.get('name'),
    lastname: formData.get('lastname'),
    email: formData.get('email'),
    password: formData.get('password')
  })


  if ( !validatedFields.success ) {

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Error al actualizar el usuario',
    }
  }

  const { name, lastname, email } = validatedFields.data
  let { password } = validatedFields.data
  if ( password ) {
    password = await bcrypt.hash(password, 10)
  }

  try {
    if (password) {
      await sql.execute(
        `UPDATE users SET name = ?, lastname = ?, email = ?, password = ?`,
        [name, lastname, email, password]
      )
    } else {
      await sql.execute(
        `UPDATE users SET name = ?, lastname = ?, email = ?`,
        [name, lastname, email]
      )
    }

  } catch ( err ) {
    console.error(err)
  }

  redirect('/itinerary/profile')
}

export async function addKardexImgToUser(prevState: string | undefined, imgUrl: string) {
  const session = await auth()

  if ( !session?.user?.email ) {
    return 'No hay una sesión activa'
  }

  const { email } = session.user

  try {
    const user = await fetchUserByEmail(email)

    if ( !user ) {
      return 'No existe dicho usuairo'
    }

    await sql.execute('UPDATE users SET kardex_photo = ? WHERE id = ?', [ imgUrl, user.id ])
    revalidatePath('/itinerary/profile')
  } catch ( err ) {
    console.error(err)
  }
}

export async function createItinerary(prevState: ItineraryState | undefined, formData: FormData) {
  const session = await auth()

  const { lat, lng } = JSON.parse(formData.get('location') as string)
  const days = [ 'l', 'ma', 'mi', 'j', 'v' ].filter(v => formData.get(v) ? v : '').join('')

  const validatedFields = CreateItineraryFormSchema.safeParse({
    plate: formData.get('plate'),
    color: formData.get('color'),
    direction: formData.get('direction'),
    hour: formData.get('hour'),
    location: lat + '' + lng,
    capacity: formData.get('capacity'),
    email: session?.user?.email,
    days,
  })

  if ( !validatedFields.success ) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Error al crear el itinerario',
    }
  }

  const { plate, color, direction, hour, capacity } = validatedFields.data
  const email = session?.user?.email

  try {
    await sql.execute(
      `INSERT INTO itineraries (plate, color, location, direction, days, hour, capacity, user_email)
        VALUES (?, ?, ST_GeomFromText(?, 4326), ?, ?, ?, ?, ?)`,
      [ plate, color, `POINT(${lat} ${lng})`, direction, days, hour + ':00', capacity, email ]
    )

    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: session?.user?.email,
        subject: 'Creación de itinerario en VST',
        text: `Has creado un itinerario en VST`
      })
    })

  } catch ( err ) {
    console.error(err)
  }

  revalidatePath('/itinerary')
  redirect('/itinerary')
}

export async function updateItinerary(prevState: ItineraryState | undefined, formData: FormData) {
  const session = await auth()

  const { lat, lng } = JSON.parse(formData.get('location') as string)
  const days = [ 'l', 'ma', 'mi', 'j', 'v' ].filter(v => formData.get(v) ? v : '').join('')

  const validatedFields = UpdateItineraryFormSchema.safeParse({
    id: formData.get('id'),
    plate: formData.get('plate'),
    color: formData.get('color'),
    direction: formData.get('direction'),
    hour: formData.get('hour'),
    location: lat + '' + lng,
    capacity: formData.get('capacity'),
    email: session?.user?.email,
    days,
  })

  if ( !validatedFields.success ) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Error al actualizar el itinerario',
    }
  }

  const { id, plate, color, direction, hour, capacity } = validatedFields.data
  try {
    await sql.execute(
      `UPDATE itineraries SET plate = ?, color = ?, location = ST_GeomFromText(?, 4326), direction = ?, days = ?, hour = ?, capacity = ? WHERE id = ? AND user_email = ?`,
      [ plate, color, `POINT(${lat} ${lng})`, direction, days, hour.split('').length === 8 ? hour : hour + ':00' , capacity, id, session?.user?.email ]
    )

  } catch ( err ) {
    console.error(err)
  }

  revalidatePath(`/itinerary/edit/${ id }`)
}

export async function enrollToItinerary(prevState: string | undefined, itineraryId: string) {
  const session = await auth()

  try {
    await sql.execute(`INSERT INTO itinerary_user_enroll (itinerary_id, user_email) VALUES (?, ?)`, [ itineraryId, session?.user?.email ])
    await sql.execute(`
      UPDATE itineraries
      SET capacity = capacity - 1
      WHERE id = ? AND capacity > 0
    `, [ itineraryId ])

    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: session?.user?.email,
        subject: 'Inscripción al itinerario en VST',
        text: `Te has inscrito al itinerario con id ${ itineraryId }, ahora debes esperar a que el conductor te acepte en el viaje, se te notificará por correo`
      })
    })

    revalidatePath(`/itinerary/${ itineraryId }`)
  } catch(err) {
    console.error(err)
  }
}

export async function unenrollFromItinerary(prevState: string | undefined, itineraryId: string) {
  const session = await auth()

  try {
    await sql.execute(`DELETE FROM itinerary_user_enroll WHERE itinerary_id = ? AND user_email = ?`, [ itineraryId, session?.user?.email ])
    await sql.execute(`
      UPDATE itineraries
      SET capacity = capacity + 1
      WHERE id = ?
    `, [ itineraryId ])

    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: session?.user?.email,
        subject: 'Desincrito del itinerario en VST',
        text: `Te has dado de baja del itinerario con id ${ itineraryId }`
      })
    })

    revalidatePath(`/itinerary/${ itineraryId }`)
  } catch(err) {
    console.error(err)
  }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    formData.append('callbackUrl', '/vst/itinerary')
    await signIn('credentials', formData)
  } catch ( error ) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales invalidas.'
        default:
          return 'Algo salió mal.'
      }
    }
    throw error
  }
}

export async function logout() {
  await signOut()
}

export async function rateUser(userEmail: string, rating: string | number, itineraryId: string) {
  const session = await auth()

  try {
    const data = await sql.execute('SELECT * FROM user_ratings WHERE rated_email = ? AND rater_email = ?', [ userEmail, session?.user?.email ])

    if ( data[0] ) {
      await sql.execute('UPDATE user_ratings SET rating = ? WHERE rated_email = ? AND rater_email = ?', [ rating, userEmail, session?.user?.email ])
    } else {
      await sql.execute('INSERT INTO user_ratings (rater_email, rated_email, rating) VALUES (?, ?, ?)', [ session?.user?.email, userEmail, rating ])
    }

    revalidatePath(`/itinerary/edit/${ itineraryId }`)
  } catch (err) {
    console.error(err)
  }
}

export async function acceptEnrolled(itineraryId: string, userEmail: string) {
  try {
    await sql.execute('UPDATE itinerary_user_enroll SET status = ? WHERE itinerary_id = ? AND user_email = ?', [ 'aceptada', itineraryId, userEmail ])

    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userEmail,
        subject: 'Información de tu itinerario en VST',
        text: `Se te ha aceptado en el itinerario con id ${ itineraryId }, puedes obtener más detalles de este itinerario en la sección Mis itinerarios de VST`
      })
    })
    revalidatePath(`/itinerary/edit/${ itineraryId }`)
  } catch (err) {
    console.error(err)
  }
}

export async function rejectEnrolled(itineraryId: string, userEmail: string) {
  try {
    await sql.execute('UPDATE itinerary_user_enroll SET status = ? WHERE itinerary_id = ? AND user_email = ?', [ 'rechazada', itineraryId, userEmail ])
    await sql.execute(`
      UPDATE itineraries
      SET capacity = capacity + 1
      WHERE id = ?
    `, [ itineraryId ])

    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userEmail,
        subject: 'Información de tu itinerario en VST',
        text: `Se te ha rechazado en el itinerario con id ${ itineraryId }, puedes intentar unirte a otro itinerario y considerar mejorar tu reputación`
      })
    })

    revalidatePath(`/itinerary/edit/${ itineraryId }`)
  } catch (err) {
    console.error(err)
  }
}
