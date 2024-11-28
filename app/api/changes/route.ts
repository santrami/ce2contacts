import { NextRequest, NextResponse } from "next/server";
import { getContactChanges, getOrganizationChanges } from "@/lib/changes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const changes = type === "contact" 
      ? await getContactChanges(parseInt(id))
      : await getOrganizationChanges(parseInt(id));

    return NextResponse.json(changes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}