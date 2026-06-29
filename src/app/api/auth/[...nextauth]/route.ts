import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
      // Request additional scopes if we want to fetch user repos etc.
      authorization: {
        params: { scope: 'read:user user:email' },
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
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
