"use client"
import { useSession } from "next-auth/react";

import React from 'react'

function page() {
    const {data: session} = useSession()
    if (session && session.user){
        console.log(session.user);
        
        return (
          <div>page</div>
        )
    }
}

export default page