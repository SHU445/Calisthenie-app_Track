import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Nom d\'utilisateur', type: 'text' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Chercher l'utilisateur par username ou email
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { username: credentials.username },
                { email: credentials.username }
              ]
            }
          });

          if (!user) {
            return null;
          }

          // Vérifier le mot de passe
          // Note: En production, il faudrait hasher les mots de passe avec bcrypt
          // Pour l'instant, on garde la vérification simple pour la migration
          const isPasswordValid = user.password === credentials.password;
          
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.username,
            image: null,
          };
        } catch (error) {
          console.error('Erreur lors de l\'authentification:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
    updateAge: 24 * 60 * 60, // 24 heures - met à jour la session toutes les 24h
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 jours
      },
    },
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
