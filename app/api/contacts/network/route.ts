import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      where: {
        network: true
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
      orderBy: {
        name: 'asc'
      }
    });

    // Transform the data to include tags
    const transformedContacts = contacts.map(contact => ({
      ...contact,
      tags: contact.tags.map(t => ({
        id: t.tag.id,
        name: t.tag.name,
        color: t.tag.color
      }))
    }));

    return NextResponse.json({ contacts: transformedContacts });
  } catch (error) {
    console.error('Error fetching network contacts:', error);
    return NextResponse.json(
      { error: "Failed to fetch network contacts" },
      { status: 500 }
    );
  }
}