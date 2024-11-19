import prisma from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '15');
  const countries = searchParams.get('countries');

  const skip = (page - 1) * limit;

  try {
    const [organizations, totalCount, countries] = await Promise.all([
      prisma.organization.findMany({
        skip,
        take: limit,
        orderBy: { fullName: 'asc' },
      }),
      prisma.organization.count(),
      prisma.organization.findMany({
        where: {
          country:{

          }
        }
      })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      countries,
      organizations,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const organization = await prisma.organization.create({ data });
    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}