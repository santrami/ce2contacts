import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const sector = searchParams.get("sector");
  const organizationType = searchParams.get("organizationType");
  const country = searchParams.get("country");
  const userId = searchParams.get("userId");

  if (!query) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  try {
    // Save search query
    await prisma.searchQuery.create({
      data: {
        query,
        userId: Number(userId),
      },
    });

    // Base search conditions
    let whereConditions: any = {
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
        },
      ],
    };

    // Add filters if provided
    if (country) {
      whereConditions.AND = [
        ...whereConditions.AND || [],
        { OR: [{ country }, { organization: { country } }] }
      ];
    }

    if (sector) {
      whereConditions.AND = [
        ...whereConditions.AND || [],
        { sector: { id: parseInt(sector) } }
      ];
    }

    if (organizationType) {
      whereConditions.AND = [
        ...whereConditions.AND || [],
        { organization: { acronym: organizationType } }
      ];
    }

    // Perform the search
    const results = await prisma.contact.findMany({
      where: whereConditions,
      include: {
        organization: true,
        sector: true,
      },
    });

    // Process and format the results
    const formattedResults = results.map(contact => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      country: contact.country || contact.organization?.country,
      sector: contact.sector?.name || "N/A",
      organization: contact.organization ? {
        id: contact.organization.id,
        name: contact.organization.fullName,
        acronym: contact.organization.acronym,
      } : null,
    }));

    return NextResponse.json({ results: formattedResults });

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 });
  }
}