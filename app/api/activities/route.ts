import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build where conditions
    const where: any = {};

    // Add optional filters
    if (searchParams.get('type')) {
      where.activityTypeId = parseInt(searchParams.get('type')!);
    }

    if (searchParams.get('from')) {
      where.date = {
        ...where.date,
        gte: new Date(searchParams.get('from')!)
      };
    }

    if (searchParams.get('to')) {
      where.date = {
        ...where.date,
        lte: new Date(searchParams.get('to')!)
      };
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        activityType: true,
        organization: true,
        participants: {
          include: {
            contact: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Ensure activityTypeId is a number
    const activityTypeId = parseInt(data.activityTypeId);
    if (isNaN(activityTypeId)) {
      return NextResponse.json(
        { error: "Invalid activity type ID" },
        { status: 400 }
      );
    }

    // Validate activityTypeId exists
    const activityType = await prisma.activityType.findUnique({
      where: { id: activityTypeId }
    });

    if (!activityType) {
      return NextResponse.json(
        { error: "Invalid activity type" },
        { status: 400 }
      );
    }

    // Create activity with parsed activityTypeId
    const activity = await prisma.activity.create({
      data: {
        ...data,
        activityTypeId
      },
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
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}