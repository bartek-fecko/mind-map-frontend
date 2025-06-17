import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';

const Backend_URL = process.env.NEXT_PUBLIC_API_URL;

async function refreshToken(token: JWT): Promise<JWT> {
  const res = await fetch(Backend_URL + '/auth/refresh', {
    method: 'POST',
    headers: {
      authorization: `Refresh ${token.backendTokens.refreshToken}`,
    },
  });

  const response = await res.json();

  return {
    ...token,
    backendTokens: response,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'jsmith',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const { username, password } = credentials;
        const res = await fetch(Backend_URL + '/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.status == 401) {
          return null;
        }
        const user = await res.json();
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;
      }
      
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
          console.log(data.backendTokens.expiresIn);
          token.backendTokens = data.backendTokens;
        } else {
          console.error('Nie udało się zamienić tokena Google na backendowy JWT');
        }
      }

      if (token.backendTokens && token.backendTokens.expiresIn) {
        if (new Date().getTime() < token.backendTokens.expiresIn) return token;
        return await refreshToken(token);
      }

      return token;
    },
    async session({ token, session }) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;

      return session;
    },
  },
};
