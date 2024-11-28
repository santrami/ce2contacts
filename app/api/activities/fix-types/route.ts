import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST() {
  try {
    // Get default activity type (Webinar)
    const defaultType = await prisma.activityType.findFirst({
      where: { name: 'Webinar' }
    });

    if (!defaultType) {
      return NextResponse.json(
        { error: "Default activity type not found" },
        { status: 500 }
      );
    }

    // Update all activities with null or invalid activity type
    const updated = await prisma.activity.updateMany({
      where: {
          OR: [
            /* @ts-ignore */
          { activityTypeId: null },
          { activityTypeId: 0 }
        ]
      },
      data: {
        activityTypeId: defaultType.id
      }
    });

    return NextResponse.json({
      message: `Updated ${updated.count} activities`,
      success: true
    });
  } catch (error) {
    console.error('Error fixing activity types:', error);
    return NextResponse.json(
      { error: "Failed to fix activity types" },
      { status: 500 }
    );
  }
}