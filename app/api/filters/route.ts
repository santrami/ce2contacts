import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    const sectors = await prisma.sector.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      sectors: sectors.map(s => ({
        id: s.id,
        name: s.name
      }))
    });
  } catch (error) {
    console.error('Error fetching filter data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter data' },
      { status: 500 }
    );
  }
}