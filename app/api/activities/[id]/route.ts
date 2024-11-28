import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        activityType: true,
        organization: true,
        participants: {
          include: {
            contact: true
          }
        }
      }
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activityId = parseInt(params.id);
    const data = await request.json();

    // Extract only updatable fields
    const {
      title,
      description,
      activityTypeId,
      date,
      duration,
      location,
      website,
      organizationId
    } = data;

    // Ensure activityTypeId is a number if provided
    const updateData: any = {
      title,
      description,
      date: new Date(date),
      duration: duration ? parseInt(duration.toString()) : null,
      location,
      website,
      organizationId: organizationId ? parseInt(organizationId.toString()) : null,
      updatedAt: new Date()
    };

    if (activityTypeId) {
      const parsedActivityTypeId = parseInt(activityTypeId.toString());
      
      // Validate activityTypeId exists
      const activityType = await prisma.activityType.findUnique({
        where: { id: parsedActivityTypeId }
      });

      if (!activityType) {
        return NextResponse.json(
          { error: "Invalid activity type" },
          { status: 400 }
        );
      }

      updateData.activityTypeId = parsedActivityTypeId;
    }

    // Update activity
    const activity = await prisma.activity.update({
      where: { id: activityId },
      data: updateData,
      include: {
        activityType: true,
        organization: true,
        participants: {
          include: {
            contact: true
          }
        }
      }
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}