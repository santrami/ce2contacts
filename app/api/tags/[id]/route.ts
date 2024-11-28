import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { entityId, entityType } = await req.json()
    const tagId = parseInt(params.id)

    if (entityType === "contact") {
      await prisma.tagsOnContacts.delete({
        where: {
          contactId_tagId: {
            contactId: entityId,
            tagId: tagId,
          },
        },
      })
    } else if (entityType === "organization") {
      await prisma.tagsOnOrganizations.delete({
        where: {
          organizationId_tagId: {
            organizationId: entityId,
            tagId: tagId,
          },
        },
      })
    }

    // Check if tag is still used by any entity
    const contactsUsingTag = await prisma.tagsOnContacts.count({
      where: { tagId },
    })
    const orgsUsingTag = await prisma.tagsOnOrganizations.count({
      where: { tagId },
    })

    // If tag is not used anymore, delete it
    if (contactsUsingTag === 0 && orgsUsingTag === 0) {
      await prisma.tag.delete({
        where: { id: tagId },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tag:", error)
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    )
  }
}