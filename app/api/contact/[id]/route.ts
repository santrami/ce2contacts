
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
  const {id} = params;
  
    try {
      const contact = await prisma.contact.findUniqueOrThrow({
        where: {
          id: parseInt(id),
        },
        include: {
          user: true,
        },
      });

      if (!contact) {
        return NextResponse.json({
            error: "Contact not found",
        }, { status: 404 });
      }
      return NextResponse.json(contact, { status: 200 });
      
    } catch (error) {
      return NextResponse.json({
        error: error.message,
      });
    }
}

export async function PATCH(req, { params }) {
  const { id } = params;
  try {
    const data = await req.json();
    const updatedContact = await prisma.contact.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}