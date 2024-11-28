import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contact = await prisma.contact.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        activityParticipation: {
          include: {
            activity: {
              include: {
                activityType: true,
                organization: true
              }
            }
          }
        },
        organization: true,
        sector: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Transform the data to handle null values and format it consistently
    const transformedContact = {
      ...contact,
      tags: contact.tags.map(t => ({
        id: t.tag.id,
        name: t.tag.name,
        color: t.tag.color
      })),
      activityParticipation: contact.activityParticipation.map(p => ({
        ...p,
        activity: {
          ...p.activity,
          activityType: p.activity.activityType || null // Allow null activityType
        }
      }))
    };

    return NextResponse.json(transformedContact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: "Failed to fetch contact details" },
      { status: 500 }
    );
  }
}