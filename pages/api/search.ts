import { Organization, Contact, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { q: query, userId } = req.query;

      if (typeof query !== "string") {
        throw new Error("Invalid request");
      }
      console.log("soy query", query);
      
      /*save query per user*/

      const user= await prisma.user.findUnique({
        where: {
          id: Number(userId)
        }
      })

      await prisma.searchQuery.create({
        data: {
          query:query,
          userId: Number(userId)
        },
      });
      //console.log(user?.email);

      /**
       * Search organization
       */
      
      const organization =
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

      const contact: Array<Contact> =
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

        console.log("soy organization", organization);
        console.log("soy contact", contact);

      /**
       * Save search
       */
      /* await prisma.searchQuery.create({
        data: {
          query,
        },
      }); */
      res.status(200).json({ organization, contact });

    } catch (error) {
      console.error(error);
      
      res.status(500).end();
    }
  }
}