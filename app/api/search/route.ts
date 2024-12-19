import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const userId = searchParams.get("userId");
    const sector = searchParams.get("sector");
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);

    // Base conditions for organizations and contacts
    const organizationWhere: any = {};
    const contactWhere: any = {};
    
    // Add sector filter if present
    if (sector) {
      contactWhere.sectorId = parseInt(sector);
      organizationWhere.contact = {
        some: {
          sectorId: parseInt(sector)
        }
      };
    }

    // Add tags filter if present
    if (tags && tags.length > 0) {
      const tagIds = tags.map(id => parseInt(id));
      organizationWhere.tags = {
        some: {
          tagId: {
            in: tagIds
          }
        }
      };
      contactWhere.tags = {
        some: {
          tagId: {
            in: tagIds
          }
        }
      };
    }

    // Add text search conditions if query exists
    if (query) {
      organizationWhere.OR = [
        { fullName: { contains: query } },
        { acronym: { contains: query } },
        { regionalName: { contains: query } },
      ];

      contactWhere.OR = [
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
      ];
    }

    // Handle numeric ID search if query exists
    if (query && /^\d+$/.test(query)) {
      const contact = await prisma.contact.findUnique({
        where: {
          id: Number(query)
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
        return NextResponse.json({ contact });
      }
    }

    // Search both organizations and contacts with filters
    const [organizations, contacts] = await Promise.all([
      prisma.organization.findMany({
        where: organizationWhere,
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

    // Save search query if it exists
    if (query && userId) {
      await prisma.searchQuery.create({
        data: {
          query,
          userId: Number(userId),
          filters: {
            sector,
            tags
          }
        },
      });
    }

    return NextResponse.json({ organizations, contacts });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}