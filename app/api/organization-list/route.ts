import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: {
        fullName: 'asc'
      },
      select: {
        id: true,
        fullName: true,
        acronym: true
      }
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}