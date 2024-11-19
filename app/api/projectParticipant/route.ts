import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const projectParticipants = await prisma.contact.findMany({
      where: { projectParticipation: true },
      include: {
        organization: true,
        sector: true,
      },
    });
    return NextResponse.json(projectParticipants);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}