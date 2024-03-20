import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"


export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(request: NextRequestWithAuth) {
        // console.log(request.nextUrl.pathname)
        //console.log(request.nextauth.token?.user.role);
        
        
        if (request.nextUrl.pathname.startsWith("/auth/register")
        && request.nextauth.token?.user!.role !== "admin") {
    
    return NextResponse.rewrite(
        new URL("/denied", request.url)
        )
    }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
)

export const config = { matcher: [
    '/((?!auth/login|reset-password|api/reset-password|auth/register|_next/static).*)',
] }

