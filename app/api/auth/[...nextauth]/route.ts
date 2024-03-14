import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '@/lib/prismadb'
import bcrypt from 'bcrypt'

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
        console.log(credentials)

        const userFound = await prisma.user.findUnique({
            where: {
                email: credentials!.email
            }
        })

        if (!userFound) throw new Error('No user found')

        console.log(userFound)

        const matchPassword = await bcrypt.compare(credentials!.password, userFound.password)

        if (!matchPassword) throw new Error('Wrong password')
        console.log(userFound);
        
        return userFound
        
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token.role = user.role;
            token.username= user.username
        }
        return token;
    },
    async session({ session, token }) {
        if (session?.user) {
          session.user.role = token.role
          session.user.name= token.username
        }
        return session
    },
},
  pages: {
    signIn: "/auth/login",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };