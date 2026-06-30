import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
      authorization: {
        params: { scope: 'read:user user:email' },
      },
    }),
    CredentialsProvider({
      name: 'Demo Account',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'admin' },
        password: { label: 'Password', type: 'password', placeholder: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.username === 'admin' && credentials?.password === 'password') {
          return {
            id: '1',
            name: 'Demo Admin',
            email: 'admin@meridian.io',
            image: 'https://avatars.githubusercontent.com/u/9919?v=4',
            login: 'demo-admin',
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and user profile to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile && 'login' in profile) {
        token.username = profile.login as string; // GitHub username
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and username
      session.accessToken = token.accessToken as string;
      session.username = token.username as string;
      return session;
    },
  },
  pages: {
    signIn: '/login', // Redirect users to custom login page
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'meridian_secret_portfolio_key_2026',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
