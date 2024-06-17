"use client"
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { SearchQuery } from "@prisma/client";

import React from 'react'

function page() {

  
  const {data: session} = useSession()
  
  /* const [data, setData] = useState(null);
    useEffect(() => {
      const fetchData = async () => {
          const response = await fetch('/api/queries');
          const data = await response.json();
          setData(data);
      };

      fetchData();
  }, []); */
  
    if (session && session.user){
        console.log(session.user);
        
        return (
          <div className="flex flex-col justify-center items-center h-screen gap-3">
            <div className="text-2xl">{session.user.username}</div>
            <div>{session.user.email}</div>
            <div>{session.user.role}</div>
            <Link href={"/"}><Button  variant={"mystyle"}>Back</Button></Link>         
          </div>
        )
    }
}

export default page