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

    // Base conditions for organizations
    const organizationWhere: any = {};
    
    // Add text search conditions if query exists
    if (query) {
      organizationWhere.OR = [
        { fullName: { contains: query } },
        { acronym: { contains: query } },
        { regionalName: { contains: query } },
      ];
    }

    // Base conditions for contacts
    const contactWhere: any = {};

    // Add text search conditions if query exists
    if (query) {
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

    // Add sector filter if present
    if (sector) {
      contactWhere.sectorId = parseInt(sector);
    }

    // Handle numeric ID search if query exists
    if (query && /^\d+$/.test(query)) {
      const contact = await prisma.contact.findUnique({
        where: {
          id: Number(query)
        },
        include: {
          organization: true,
          sector: true
        }
      });

      if (contact) {
        return NextResponse.json({ contact });
      }
    }

    // Search both organizations and contacts
    const [organization, contacts] = await Promise.all([
      prisma.organization.findMany({
        where: organizationWhere,
        include: {
          contact: true
        }
      }),
      prisma.contact.findMany({
        where: contactWhere,
        include: {
          organization: true,
          sector: true
        }
      })
    ]);

    // Save search query if it exists
    if (query && userId) {
      await prisma.searchQuery.create({
        data: {
          query,
          userId: Number(userId)
        },
      });
    }

    return NextResponse.json({ organization, contacts });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}