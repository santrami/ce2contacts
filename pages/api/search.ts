import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { 
        q: query, 
        userId,
        sector
      } = req.query;

      // Save search query if it exists
      if (query && userId) {
        await prisma.searchQuery.create({
          data: {
            query: query as string,
            userId: Number(userId)
          },
        });
      }

      // Base conditions for contacts
      const contactWhere: any = {};

      // Add text search conditions if query exists
      if (query) {
        contactWhere.OR = [
          { name: { contains: query as string } },
          { email: { contains: query as string } },
          { 
            organization: {
              OR: [
                { fullName: { contains: query as string } },
                { acronym: { contains: query as string } },
                { regionalName: { contains: query as string } },
              ]
            } 
          }
        ];
      }

      // Add sector filter if present
      if (sector) {
        contactWhere.sectorId = parseInt(sector as string);
      }

      // Handle numeric ID search if query exists
      if (query && /^\d+$/.test(query as string)) {
        const contact = await prisma.contact.findUnique({
          where: {
            id: Number(query)
          },
          include: {
            organization: true,
            sector: true
          }
        });

        if (contact) {
          res.status(200).json({ contact });
          return;
        }
      }

      // If sector filter is applied, only search contacts
      if (sector) {
        const contacts = await prisma.contact.findMany({
          where: contactWhere,
          include: {
            organization: true,
            sector: true
          }
        });

        res.status(200).json({ contacts });
        return;
      }

      // For text search, get both organizations and contacts
      if (query) {
        const [organization, contacts] = await Promise.all([
          prisma.organization.findMany({
            where: {
              OR: [
                { fullName: { contains: query as string } },
                { acronym: { contains: query as string } },
                { regionalName: { contains: query as string } },
              ]
            },
            include: {
              contact: true
            }
          }),
          prisma.contact.findMany({
            where: contactWhere,
            include: {
              organization: true,
              sector: true
            }
          })
        ]);

        res.status(200).json({ organization, contacts });
        return;
      }

      // If no filters, return empty results
      res.status(200).json({ contacts: [] });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}