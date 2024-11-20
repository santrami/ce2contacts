import prisma from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '15');
  const sector = searchParams.get('sector');

  const skip = (page - 1) * limit;

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

    const [organizations, totalCount, countries] = await Promise.all([
      prisma.organization.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { fullName: 'asc' },
        include: {
          contact: true
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

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      organizations,
      countries,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}