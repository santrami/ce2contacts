import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { withCache } from "@/lib/cache";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const sector = searchParams.get('sector');
  const cacheKey = `organizations:${page}:${sector || 'all'}`;

  try {
    // Build where conditions
    const whereConditions: any = {};

    // If sector is selected, filter organizations that have contacts in that sector
    if (sector) {
      whereConditions.contact = {
        some: {
          sectorId: parseInt(sector)
        }
      };
    }

    const skip = (page - 1) * PAGE_SIZE;

    // Execute database queries
    const [organizations, totalCount, countries] = await prisma.$transaction([
      prisma.organization.findMany({
        where: whereConditions,
        skip,
        take: PAGE_SIZE,
        orderBy: { fullName: 'asc' },
        include: {
          contact: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      }),
      prisma.organization.count({
        where: whereConditions
      }),
      prisma.organization.findMany({
        where: {
          country: {
            not: null
          }
        },
        select: {
          country: true
        },
        distinct: ['country']
      })
    ]);

    // Transform the data
    const transformedOrganizations = organizations.map(org => ({
      ...org,
      tags: org.tags.map(t => ({
        id: t.tag.id,
        name: t.tag.name,
        color: t.tag.color
      }))
    }));

    return NextResponse.json({
      organizations: transformedOrganizations,
      countries,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.fullName) {
      return NextResponse.json(
        { error: "Organization full name is required" },
        { status: 400 }
      );
    }

    // Create the organization
    const organization = await prisma.organization.create({
      data: {
        acronym: data.acronym || null,
        fullName: data.fullName,
        regionalName: data.regionalName || null,
        website: data.website || null,
        country: data.country || null
      },
      include: {
        contact: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(organization);
  } catch (error: any) {
    // Handle unique constraint violations
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: `Organization with this ${error.meta?.target[0]} already exists` },
        { status: 400 }
      );
    }

    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 }
    );
  }
}