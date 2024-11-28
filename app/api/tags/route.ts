import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export async function POST(req: NextRequest) {
  try {
    const { name, color, entityId, entityType } = await req.json()

    // First, create or find the tag
    const tag = await prisma.tag.upsert({
      where: { name },
      update: { color },
      create: { name, color },
    })

    // Then, create the association based on entity type
    if (entityType === "contact") {
      await prisma.tagsOnContacts.create({
        data: {
          contactId: entityId,
          tagId: tag.id,
        },
      })
    } else if (entityType === "organization") {
      await prisma.tagsOnOrganizations.create({
        data: {
          organizationId: entityId,
          tagId: tag.id,
        },
      })
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const entityId = searchParams.get("entityId")
    const entityType = searchParams.get("entityType")

    let tags
    if (entityType === "contact") {
      tags = await prisma.tagsOnContacts.findMany({
        where: { contactId: Number(entityId) },
        include: { tag: true },
      })
    } else if (entityType === "organization") {
      tags = await prisma.tagsOnOrganizations.findMany({
        where: { organizationId: Number(entityId) },
        include: { tag: true },
      })
    }

    return NextResponse.json(tags?.map(t => t.tag) ?? [])
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    )
  }
}