//this endpoint is used for sending organization by id and their contacts to organization details

import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export async function GET(request, {params}) {
  const {id} = params;  
  
  
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: parseInt(id),
        },
        include: {
          contact: true,
        },
      });

      if (!user) {
        return NextResponse.json({
            error: "User not found",
        }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
      
    } catch (error) {
      return NextResponse.json({
        error: error.message,
      });
    }
}

export async function POST(req, {params}) {
  const {id} = params;  
    try {
      const data = await req.json(); // Parse the JSON body
      console.log(data);
      const hashPassword=await bcrypt.hash(data.password,10)
      data.password=hashPassword

      const updatedUser = await prisma.user.update({
          where: { id: parseInt(id) }, // Adjust if your ID is a string/UUID
          data,
      });
      
      return NextResponse.json(updatedUser, { status: 200 });
    } catch (e) {
      return NextResponse.json({
        error: e,
    }, { status: 500 });
    }
}