import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      theme: string;
      units: string;
      language: string;
      dateCreation: string;
    };
  }

  interface User {
    id: string;
    username: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    theme: string;
    units: string;
    language: string;
    dateCreation: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username: string;
    theme: string;
    units: string;
    language: string;
    dateCreation: string;
  }
}