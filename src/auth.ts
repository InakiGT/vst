import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import type { User } from '@/app/lib/definitions'
import bcrypt from 'bcrypt'
import mysql, { RowDataPacket } from 'mysql2/promise'

const sql = await mysql.createConnection(process.env.MYSQL_URI || '')

async function getUser(email: string): Promise<User | undefined> {
    try {
      const [ rows ] = await sql.execute<(User & RowDataPacket)[]>(`SELECT * FROM users WHERE email=?`, [ email ])

      return rows[0]
    } catch ( err ) {
      console.error('Failed to fetch user', err);
      throw new Error('Failed to fetch user')
    }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parseCredentials =
        z.object({ email: z.string().email(), password: z.string().min(5) })
        .safeParse(credentials)

        if ( parseCredentials.success ) {
          const { email, password } = parseCredentials.data;
          const user = await getUser(email)

          if (!user) return null
          const passwordMatch = await bcrypt.compare(password, user.password)
          if (passwordMatch) return user
        }

        return null
    }
  })],
})
