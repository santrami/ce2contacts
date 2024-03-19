import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '@/lib/prismadb'
import bcrypt from 'bcrypt'
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {User} from '@prisma/client'

export const authOptions = { 
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      // @ts-ignore
      async authorize(credentials) {

        const userFound = await prisma.user.findUnique({
            where: {
                email: credentials!.email
            }
        })

        if (!userFound) throw new Error('No user found')


        const matchPassword = await bcrypt.compare(credentials!.password, userFound.password)

        if (!matchPassword) throw new Error('Wrong password')
        
        const { password, ...userWithoutPass } = userFound;
        return userWithoutPass;
        
      },
    }),
    /* EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }), */
  ],
  callbacks: {
    async jwt({ token, user }) {
      
        if (user) {
            token.user=user
        }
        return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      console.log(token);
      return session;
    },
},
  pages: {
    signIn: "/auth/login",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };