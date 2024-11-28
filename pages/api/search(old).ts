import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const userId = searchParams.get("userId");
    const sector = searchParams.get("sector");

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    // Save search query if userId is provided
    if (userId) {
      await prisma.searchQuery.create({
        data: {
          query,
          userId: parseInt(userId),
        },
      });
    }

    // Base conditions for contacts
    const contactWhere: any = {
      OR: [
        { name: { contains: query } },
        { email: { contains: query } },
        { 
          organization: {
            OR: [
              { fullName: { contains: query } },
              { acronym: { contains: query } },
              { regionalName: { contains: query } },
            ]
          } 
        }
      ]
    };

    // Add sector filter if present
    if (sector) {
      contactWhere.sectorId = parseInt(sector);
    }

    // Handle numeric ID search
    if (/^\d+$/.test(query)) {
      const contact = await prisma.contact.findUnique({
        where: { id: parseInt(query) },
        include: {
          organization: true,
          sector: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      });

      if (contact) {
        const transformedContact = {
          ...contact,
          tags: contact.tags.map(t => ({
            id: t.tag.id,
            name: t.tag.name,
            color: t.tag.color
          }))
        };
        return NextResponse.json({ contact: transformedContact });
      }
    }

    // Perform the search
    const [organization, contacts] = await Promise.all([
      prisma.organization.findMany({
        where: {
          OR: [
            { fullName: { contains: query } },
            { acronym: { contains: query } },
            { regionalName: { contains: query } },
          ]
        },
        include: {
          contact: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      }),
      prisma.contact.findMany({
        where: contactWhere,
        include: {
          organization: true,
          sector: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      })
    ]);

    // Transform the data to include tags
    const transformedContacts = contacts.map(contact => ({
      ...contact,
      tags: contact.tags.map(t => ({
        id: t.tag.id,
        name: t.tag.name,
        color: t.tag.color
      }))
    }));

    const transformedOrganizations = organization.map(org => ({
      ...org,
      tags: org.tags.map(t => ({
        id: t.tag.id,
        name: t.tag.name,
        color: t.tag.color
      }))
    }));

    return NextResponse.json({
      organization: transformedOrganizations,
      contacts: transformedContacts
    });

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}