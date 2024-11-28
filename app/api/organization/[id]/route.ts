import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { trackOrganizationChange } from "@/lib/changes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        contact: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json(organization);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = parseInt(params.id);
    const data = await request.json();

    // Get current organization data
    const currentOrganization = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!currentOrganization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Track changes for each modified field
    const changedBy = parseInt(session.user.id);
    const trackableFields = ['acronym', 'fullName', 'regionalName', 'website', 'country'];

    for (const field of trackableFields) {
      if (data[field] !== undefined && data[field] !== currentOrganization[field]) {
        await trackOrganizationChange(
          organizationId,
          field,
          String(currentOrganization[field]),
          String(data[field]),
          changedBy
        );
      }
    }

    // Update the organization
    const updatedOrganization = await prisma.organization.update({
      where: { id: organizationId },
      data,
      include: {
        contact: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(updatedOrganization);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}