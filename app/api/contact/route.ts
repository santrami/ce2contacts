
import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
      const contacts = await prisma.contact.findMany();

      return NextResponse.json(contacts);
    } catch (error) {
        return NextResponse.json({
            error: error.message,
        });
    }
}

export async function POST(req: NextRequest) {
    try {
      const data = await req.json();
      const newContact = await prisma.contact.create({ data });
      return NextResponse.json({ message: "Contact created successfully", contact: newContact }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }