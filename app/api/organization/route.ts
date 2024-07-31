
import prisma from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
    try {
      const organizations = await prisma.organization.findMany();

      return NextResponse.json(organizations);
    } catch (error) {
        return NextResponse.json({
            error: error.message,
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const {country, ...rest } = data

        console.log(data);
        
        
        const organization = await prisma.organization.create({
            data
        });

        console.log(organization);
        

        return NextResponse.json(organization);
    }catch (error) {
        return NextResponse.json({
            error: error.message,
        });
    }
}