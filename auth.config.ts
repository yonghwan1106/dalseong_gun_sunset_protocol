import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow all Google accounts (domain check disabled for development)
      // Production: Uncomment the lines below to restrict to @dalseong.go.kr
      /*
      const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || 'dalseong.go.kr';
      if (user.email && user.email.endsWith(`@${allowedDomain}`)) {
        return true;
      }
      return false;
      */

      // For now, allow all Google accounts
      return true;
    },
    async session({ session, token }) {
      // Add user info to session
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};
