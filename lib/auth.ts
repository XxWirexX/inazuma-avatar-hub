import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import DiscordProvider from 'next-auth/providers/discord'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/db/mongodb'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db/mongodb'

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,

  providers: [
    // Credentials Provider (email/password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis')
        }

        const db = await getDb()
        const user = await db.collection('users').findOne({
          email: credentials.email,
        })

        if (!user || !user.password) {
          throw new Error('Identifiants invalides')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Identifiants invalides')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),

    // Google OAuth (si configuré)
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),

    // Discord OAuth (si configuré)
    ...(process.env.DISCORD_CLIENT_ID
      ? [
          DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
