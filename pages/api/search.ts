import { organization, contact } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { q: query } = req.query;

      if (typeof query !== "string") {
        throw new Error("Invalid request");
      }

      /**
       * Search organization
       */
      const organization: Array<organization> =
        await prisma.organization.findMany({
          where: {
            OR: [
              {
                fullName: {
                  contains: query,
                },
              },
              {
                acronym: {
                  contains: query,
                },
              },
              {
                country: {
                  contains: query,
                },
              },
              {
                regionalName: {
                  contains: query,
                },
              },
            ],
          },
        });

      /**
       * Save search
       */
      /* await prisma.searchQuery.create({
        data: {
          query,
        },
      }); */

      const contact: Array<contact> =
        await prisma.contact.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: query,
                },
              },
              {
                email: {
                  contains: query,
                },
              },
            ],
          },
          include: {
            organization: true,
          },
        });



      /**
       * Save search
       */
      /* await prisma.searchQuery.create({
        data: {
          query,
        },
      }); */
      res.status(200).json({ organization, contact });

    } catch (error: any) {
      res.status(500).end();
    }
  }
}