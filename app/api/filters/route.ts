import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    // First check if sectors exist
    const sectorCount = await prisma.sector.count();

    // If no sectors exist, create default ones
    if (sectorCount === 0) {
      await prisma.sector.createMany({
        data: [
          { name: 'Research' },
          { name: 'Government' },
          { name: 'Private Sector' },
          { name: 'NGO' },
          { name: 'Education' },
          { name: 'Research & Academia' }
        ],
        skipDuplicates: true
      });
    }

    // Now fetch all sectors
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
      { error: 'Failed to fetch filter data', sectors: [] },
      { status: 500 }
    );
  }
}