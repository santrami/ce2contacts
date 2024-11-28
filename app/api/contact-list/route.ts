import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { withCache } from "@/lib/cache";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const sector = searchParams.get('sector');
  const cacheKey = `contacts:${page}:${sector || 'all'}`;

  try {
    return await withCache(cacheKey, async () => {
      const whereConditions: any = {};
      
      if (sector) {
        whereConditions.sectorId = parseInt(sector);
      }

      const skip = (page - 1) * PAGE_SIZE;

      const [contacts, totalCount] = await prisma.$transaction([
        prisma.contact.findMany({
          where: whereConditions,
          skip,
          take: PAGE_SIZE,
          orderBy: { name: 'asc' },
          include: {
            organization: true,
            sector: true,
            tags: {
              include: {
                tag: true
              }
            }
          }
        }),
        prisma.contact.count({
          where: whereConditions
        })
      ]);

      // Transform the data to include tags
      const transformedContacts = contacts.map(contact => ({
        ...contact,
        tags: contact.tags.map(t => ({
          id: t.tag.id,
          name: t.tag.name,
          color: t.tag.color
        }))
      }));

      return NextResponse.json({
        contacts: transformedContacts,
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
        currentPage: page,
      });
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}