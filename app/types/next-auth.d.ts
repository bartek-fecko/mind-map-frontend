// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    } | null;
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    } | null;
    error: unknown;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    backendTokens?: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    } | null;
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    } | null;
    error?: string;
  }
}
