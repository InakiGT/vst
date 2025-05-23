import mysql, { RowDataPacket } from 'mysql2/promise'
import type { EnrolledUser, UserEnrolled, ItineraryFromDb } from './definitions'
import { auth } from '@/auth'
import { type User } from '@/app/lib/definitions'
import { MyItinerary } from '@/app/itinerary/my/page'

const sql = await mysql.createConnection(process.env.MYSQL_URI || '')

export async function fetchIntineraries(): Promise<ItineraryFromDb[]> {
  try {
    const [ rows ] = await sql.execute<(ItineraryFromDb & RowDataPacket)[]>('SELECT * FROM itineraries;')
    return rows
  } catch (err) {
    console.error(err)
    throw new Error('Error trying to get itineraries from database')
  }
}

export async function fetchItinerariesByUser(): Promise<MyItinerary[]> {
  const session = await auth()

  try {
    const [ rows ] = await sql.execute<(MyItinerary & RowDataPacket)[]>('SELECT * FROM itineraries AS i JOIN itinerary_user_enroll AS iu ON iu.itinerary_id = i.id WHERE iu.user_email = ?;', [ session?.user?.email ])

    return rows
  } catch (err) {
    console.error(err)
    throw new Error('Error trying to get itineraries from database')
  }
}

export async function fetchItineraryById(id: string): Promise<ItineraryFromDb | undefined> {
  try {
    const [ rows ] = await sql.execute<(ItineraryFromDb & RowDataPacket)[]>('SELECT * FROM itineraries AS i JOIN users AS u ON i.user_email = u.email WHERE i.id=?;', [ id ])

    return rows[0]
  } catch(err) {
    console.error(err)
    throw new Error('Error trying to get an itinerary from database')
  }
}

export async function fetchKardexPhotoByEmail(): Promise<string | undefined> {
  const session = await auth()
  try {
      const [ rows ] = await sql.execute<(string & RowDataPacket)[]>('SELECT kardex_photo FROM users WHERE email = ?', [ session?.user?.email ])

      return rows[0].kardex_photo
  } catch ( err ) {
      console.error('Failed to fetch user', err)
      throw new Error('Failed to fetch user')
  }
}

export async function fetchUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [ rows ] = await sql.execute<(User & RowDataPacket)[]>(`SELECT * FROM users WHERE email=?`, [ email ])

      return rows[0]
    } catch ( err ) {
      console.error('Failed to fetch user', err)
      throw new Error('Failed to fetch user')
    }
}

export async function fetchEnrolledUserByItineraryId(id: string): Promise<EnrolledUser | undefined> {
  const session = await auth()

  try {
    const [ rows ] = await sql.execute<(EnrolledUser & RowDataPacket)[]>('SELECT * FROM itinerary_user_enroll WHERE itinerary_id = ? AND user_email = ?;', [ id, session?.user?.email ])

    return rows[0]
  } catch(err) {
    console.error(err)
    throw new Error('Error trying to get an itinerary_user_enroll from database')
  }
}

export async function fetchEnrolledUsersByItineraryId(id: string): Promise<UserEnrolled[] | undefined> {
  try {
    const [ rows ] = await sql.execute<(UserEnrolled & RowDataPacket)[]>(`SELECT
        u.*,
        i.status,
        ROUND(AVG(r.rating), 1) AS average_rating
      FROM
        users AS u
      JOIN
        itinerary_user_enroll AS i ON i.user_email = u.email
      LEFT JOIN
        user_ratings AS r ON r.rated_email = u.email
      WHERE
        i.itinerary_id = ?
      GROUP BY
        u.email, i.status;
      `, [ id ])

    return rows
  } catch(err) {
    console.error(err)
    throw new Error('Error trying to get an itinerary_user_enroll from database')
  }
}
