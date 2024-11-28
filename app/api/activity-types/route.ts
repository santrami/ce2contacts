import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    const activityTypes = await prisma.activityType.findMany({
      orderBy: { name: 'asc' }
    });

    if (!activityTypes || activityTypes.length === 0) {
      // If no activity types exist, create default ones
      const defaultTypes = [
        { name: 'Webinar' },
        { name: 'Workshop' },
        { name: 'Survey' },
        { name: 'Interview' },
        { name: 'Focus Group' },
        { name: 'Webstival' }
      ];

      await prisma.activityType.createMany({
        data: defaultTypes,
        skipDuplicates: true
      });

      return NextResponse.json(await prisma.activityType.findMany({
        orderBy: { name: 'asc' }
      }));
    }

    return NextResponse.json(activityTypes);
  } catch (error) {
    console.error('Error fetching activity types:', error);
    return NextResponse.json(
      { error: "Failed to fetch activity types" },
      { status: 500 }
    );
  }
}