import { Database } from "db/database";
import NextAuth, { User } from "next-auth";
import GithubProvider from "next-auth/providers/github";

type ProviderDict = Partial<Record<string, (user: User) => Promise<boolean>>>;

const signInFromProviders: ProviderDict = {
  github: async (user: User) => {
    if (user.id) return Database.isAllowedUser(user.id);
    return false;
  },
};

export default NextAuth({
  callbacks: {
    signIn: async (args) => {
      const providerValidator = signInFromProviders[args.account.provider];
      if (providerValidator) {
        return providerValidator(args.user);
      }
      return false;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
});
