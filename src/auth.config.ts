import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/vst/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user

      const isOnDashboard = nextUrl.pathname.startsWith('/vst/itinerary')
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/vst/itinerary', nextUrl));
      }
      return true
    },
  },
  basePath: '/vst',
  providers: [],
  trustHost: true,
} satisfies NextAuthConfig
