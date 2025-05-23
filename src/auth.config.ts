import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user

      const isOnDashboard = nextUrl.pathname.startsWith('/itinerary')
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/vst/itinerary', nextUrl));
      }
      return true
    },
  },
  basePath: '/vst/api/auth',
  providers: [],
  trustHost: true,
} satisfies NextAuthConfig
