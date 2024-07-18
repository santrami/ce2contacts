import CredentialsProvider from "next-auth/providers/credentials";
import prismadb from '@/lib/prismadb'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {User} from '@prisma/client'
import { SessionStrategy } from "next-auth";

export const authOptions = { 
  //adapter: PrismaAdapter(prismadb),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      // @ts-ignore
      async authorize(credentials) {

        const userFound = await prismadb.user.findUnique({
            where: {
                email: credentials!.email
            }
        })

        if (!userFound) throw new Error('No user found')
        
        const matchPassword = await bcrypt.compare(credentials!.password, userFound.password)

        if (!matchPassword) throw new Error('Wrong password')
        
        const { password, ...userWithoutPass } = userFound;
        //console.log(userWithoutPass);
        
        return userWithoutPass;
        
      },
    }),
  ],
  adapter: PrismaAdapter(prismadb),
  /* session: {
    strategy: 'jwt',
  }, */
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 60*60*24
},
  callbacks: {
    async jwt({ token, user }) {
      //console.log(user, token);
      
      if (user) {
        token.user=user as User
      }
      console.log(token);
        return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      //console.log(token);
      return session;
    },

    /* async jwt({token, profile, account}) {
      if (profile) {
        token.username = profile.username;
      }

      if (account) {
        token.access_token = account.access_token;
      }
      return token;
  },
  async session({ session, token }) {
    if (token) {
      session.user.username = token.username;
    }
    return session;
  } */



},
  pages: {
    signIn: "/auth/login",
  }
};

