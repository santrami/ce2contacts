import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Extract values from select objects
    const formattedData = {
      name: data.name,
      email: data.email,
      country: data.country,
      projectParticipation: Boolean(data.projectParticipation),
      organizationId: typeof data.organizationId === 'object' ? 
        parseInt(data.organizationId.value) : 
        parseInt(data.organizationId),
      sectorId: typeof data.sectorId === 'object' ? 
        parseInt(data.sectorId.value) : 
        parseInt(data.sectorId),
      termsId: data.termsId ? parseInt(data.termsId) : null
    };

    const newContact = await prisma.contact.create({
      data: formattedData,
      include: {
        organization: true,
        sector: true,
        acceptedTerms: true
      }
    });

    return NextResponse.json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        organization: true,
        sector: true,
        acceptedTerms: true
      }
    });
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}