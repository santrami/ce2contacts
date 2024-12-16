import prisma from '@/lib/prismadb';
import { withCache } from '@/lib/cache';

const PAGE_SIZE = 20;

export async function getOrganizations(page: number = 1, sector?: string | null) {
  const cacheKey = `organizations:${page}:${sector || 'all'}`;

  try {
    return await withCache(cacheKey, async () => {
      const whereConditions: any = {};
      
      if (sector) {
        whereConditions.contact = {
          some: {
            sectorId: parseInt(sector)
          }
        };
      }

      const skip = (page - 1) * PAGE_SIZE;

      const [organizations, totalCount] = await prisma.$transaction([
        prisma.organization.findMany({
          where: whereConditions,
          skip,
          take: PAGE_SIZE,
          orderBy: { fullName: 'asc' },
          include: {
            contact: true,
            tags: {
              include: {
                tag: true
              }
            }
          }
        }),
        prisma.organization.count({
          where: whereConditions
        })
      ]);

      return {
        organizations,
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
        currentPage: page,
      };
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
}