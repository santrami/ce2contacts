import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import bcrypt from 'bcrypt'

export async function POST (request:NextRequest){
    try {
        const data = await request.json()
    console.log(data);
    
    const emailFound = await prismadb.user.findUnique({
        where: {
            email:data.email
        }
    })

    if(emailFound){
        return NextResponse.json({
            message:'email already exists'
        },{
            status:400
        })
    }

    const userFound = await prismadb.user.findUnique({
        where: {
            username:data.username
        }
    })

    if(userFound){
        return NextResponse.json({
            message:'user already exists'
        },{
            status:400
        })
    }

    const hashPassword=await bcrypt.hash(data.password,10)
    
    const newUser=await prismadb.user.create({
        data: {
            username: data.username,
            email: data.email,
            password: hashPassword,
            role:"admin",
            contactId:2941
        }
    })

    const {password: _, ...user} = newUser

    return NextResponse.json({"message": "user created"})
    
    } catch (error:any) {
        return NextResponse.json({
            message: error.message
        },
        {
            status: 500
        }
        )
    }
}