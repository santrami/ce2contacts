import prisma from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const organization = await prisma.organization.findUniqueOrThrow({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(organization);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await req.json();
    const updatedOrganization = await prisma.organization.update({
      where: { id: parseInt(id) },
      data,
    });
    return NextResponse.json(updatedOrganization);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}