
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
  const {id} = params;
  
    try {
      const organization = await prisma.organization.findUniqueOrThrow({
        where: {
          id: parseInt(id),
        }
      });

      if (!organization) {
        return NextResponse.json({
            error: "Organization not found",
        }, { status: 404 });
      }
      return NextResponse.json(organization, { status: 200 });
      
    } catch (error) {
      return NextResponse.json({
        error: error.message,
      });
    }
}

export async function PATCH(req, {params}) {
    const {id} = params;  
    try {
      const data = await req.json(); // Parse the JSON body
      const updatedOrganization = await prisma.organization.update({
          where: { id: parseInt(id) }, // Adjust if your ID is a string/UUID
          data,
      });
      
      return NextResponse.json(updatedOrganization, { status: 200 });
    } catch (e) {
      return NextResponse.json({
        error: e,
    }, { status: 500 });
    }
}