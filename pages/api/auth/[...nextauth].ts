import { Database } from "db/database";
import NextAuth, { User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

type ProviderDict = Partial<Record<string, (user: User) => Promise<boolean>>>;

const signInFromProviders: ProviderDict = {
  github: async (user: User) => {
    if (user.id) {
      try {
        console.log(user)
        return Database.isAllowedUser(`${user.id}`);
      } catch (error) {
        return false;
      }
    }
    return false;
  },
};

export default NextAuth({
  adapter: PrismaAdapter(Database.Client),
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
