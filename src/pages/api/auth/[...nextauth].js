// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/db/db';
import { adminUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          const users = await db
            .select()
            .from(adminUsers)
            .where(eq(adminUsers.username, credentials.username))
            .limit(1);

          const user = users[0];

          if (!user || !user.hashedPassword) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user.id.toString(),
            username: user.username,
            role: user.role
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  }
};

export default NextAuth(authOptions);