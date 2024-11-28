import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const userId = searchParams.get("userId");
    const sector = searchParams.get("sector");
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);

    // Save search query if userId is provided and there's a query
    if (userId && query) {
      await prisma.searchQuery.create({
        data: {
          query,
          userId: parseInt(userId),
          filters: { sector, tags }
        },
      });
    }

    // Check if query is a numeric ID
    if (query && /^\d+$/.test(query)) {
      const contact = await prisma.contact.findUnique({
        where: {
          id: parseInt(query)
        },
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
        // Transform contact data
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

    // Base conditions for contacts
    const contactWhere: any = {
      AND: []
    };

    // Add text search conditions if query exists
    if (query) {
      contactWhere.AND.push({
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
      });
    }

    // Add sector filter if present
    if (sector) {
      contactWhere.AND.push({ sectorId: parseInt(sector) });
    }

    // Add tags filter if present
    if (tags && tags.length > 0) {
      const tagIds = tags.map(id => parseInt(id));
      contactWhere.AND.push({
        tags: {
          some: {
            tagId: {
              in: tagIds
            }
          }
        }
      });
    }

    // If no conditions were added, remove the empty AND array
    if (contactWhere.AND.length === 0) {
      delete contactWhere.AND;
    }

    // Only fetch organizations if no sector filter is applied
    const [organizations, contacts] = await Promise.all([
      !sector ? prisma.organization.findMany({
        where: {
          ...(query && {
            OR: [
              { fullName: { contains: query } },
              { acronym: { contains: query } },
              { regionalName: { contains: query } },
            ]
          }),
          ...(tags?.length && {
            tags: {
              some: {
                tagId: {
                  in: tags.map(id => parseInt(id))
                }
              }
            }
          })
        },
        include: {
          contact: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      }) : [],
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

    const transformedOrganizations = organizations.map(org => ({
      ...org,
      tags: org.tags.map(t => ({
        id: t.tag.id,
        name: t.tag.name,
        color: t.tag.color
      }))
    }));

    // Get total counts
    const totalContacts = transformedContacts.length;
    const totalOrganizations = transformedOrganizations.length;

    return NextResponse.json({
      organization: transformedOrganizations,
      contacts: transformedContacts,
      counts: {
        contacts: totalContacts,
        organizations: totalOrganizations,
        total: totalContacts + totalOrganizations
      }
    });

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}