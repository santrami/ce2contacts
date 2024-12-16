import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    const projectParticipants = await prisma.contact.findMany({
      where: { 
        projectParticipation: true 
      },
      include: {
        organization: true,
        sector: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
    });

    // Transform the data to match the expected format
    const formattedParticipants = projectParticipants.map(participant => ({
      ...participant,
      tags: participant.tags.map(t => ({
        id: t.tag.id,
        name: t.tag.name,
        color: t.tag.color
      }))
    }));

    return NextResponse.json(formattedParticipants);
  } catch (error) {
    console.error('Error fetching project participants:', error);
    return NextResponse.json(
      { error: "Failed to fetch project participants" },
      { status: 500 }
    );
  }
}