import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { trackContactChange } from "@/lib/changes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
        organization: true,
        sector: true,
        acceptedTerms: true,
        activityParticipation: {
          include: {
            activity: {
              include: {
                activityType: true
              }
            }
          }
        },
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
          activityType: p.activity.activityType || { name: 'Unknown Type' }
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contactId = parseInt(params.id);
    const data = await request.json();

    // Get current contact data
    const currentContact = await prisma.contact.findUnique({
      where: { id: contactId }
    });

    if (!currentContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Track changes for each modified field
    const changedBy = parseInt(session.user.id);
    const trackableFields = ['name', 'email', 'organizationId', 'projectParticipation', 'country', 'termsId'];

    for (const field of trackableFields) {
      if (data[field] !== undefined && data[field] !== currentContact[field]) {
        await trackContactChange(
          contactId,
          field,
          String(currentContact[field]),
          String(data[field]),
          changedBy
        );
      }
    }

    // Update the contact
    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data,
      include: {
        organization: true,
        sector: true,
        acceptedTerms: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}