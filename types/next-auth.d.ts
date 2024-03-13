/* import NextAuth from "next-auth"

declare module "next-auth" {

  interface Session {
    user: {
      
      role: string,
      name:string,
      username:string,
    }
  }
} */

import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string,
            role: string,
            name:string,
        } & DefaultSession
    }

    interface User extends DefaultUser {
        role: string,
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role: string,
    }
}