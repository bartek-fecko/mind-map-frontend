import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';

const Backend_URL = process.env.NEXT_PUBLIC_API_URL;

async function refreshToken(token: JWT): Promise<JWT | null> {
  const res = await fetch(`${Backend_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      authorization: `Refresh ${token?.backendTokens?.refreshToken}`,
    },
  });

  if (!res.ok) {
    return null;
  }

  const response = await res.json();

  return {
    ...token,
    backendTokens: response,
  };
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
    verifyRequest: '/',
    newUser: '/signup',
  },
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(`${Backend_URL}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) return null;

        const data = await res.json();

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          image: data.user.image,
          backendTokens: data.backendTokens,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }): Promise<JWT> {
      if (account && account.provider === 'google') {
        const res = await fetch(`${Backend_URL}/auth/google-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: account.id_token || account.access_token }),
        });

        if (res.ok) {
          const data = await res.json();

          token.backendTokens = data.backendTokens;
          token.user = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
          };
        } else {
          console.error('Google token exchange failed');
        }
      } else if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
        token.backendTokens = user.backendTokens!;
      }

      if (token.backendTokens?.expiresIn && Date.now() >= token.backendTokens.expiresIn) {
        const refreshedToken = await refreshToken(token);
        if (!refreshedToken) {
          return {
            ...token,
            error: 'TokenExpired',
            user: null,
            backendTokens: null,
          };
        }
        return refreshedToken;
      }

      return token;
    },

    async session({ token, session }) {
      session.user = token.user ?? null;
      session.backendTokens = token.backendTokens ?? null;
      session.error = token.error ?? null;
      return session;
    },

    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
};
