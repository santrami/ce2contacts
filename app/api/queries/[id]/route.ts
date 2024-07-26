//this endpoint is used for sending organization by id and their contacts to organization details

import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
  const {id} = params;
  console.log(params); 
  
    try {
      const queries = await prisma.searchQuery.findMany({
        where: {
          userId: parseInt(id),
        }        
      });

      if (!queries) {
        return NextResponse.json({
            error: "query not found",
        }, { status: 404 });
      }
      return NextResponse.json(queries, { status: 200 });
      
    } catch (error) {
      return NextResponse.json({
        error: error,
      });
    }
}
