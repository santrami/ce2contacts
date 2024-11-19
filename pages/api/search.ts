import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

type Contact = {
  id: number;
  name: string;
  email: string;
  organizationId: number | null;
  country: string | null;
  projectParticipation: boolean;
  termsId: number | null;
  sectorId: number | null;
  userId: number | null;
}

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
      
      /*save query per user*/
      await prisma.searchQuery.create({
        data: {
          query:query,
          userId: Number(userId)
        },
      });

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

      const contacts: Array<Contact> =
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


        
        const reg = new RegExp('^[0-9]+$');
        
        if(query.match(reg)){
          const contact = await prisma.contact.findUnique({
            where: {
              id: Number(query)
            },
            include: {
              organization: true,
            }
          });
  
          if(contact){
            res.status(200).json({ contact });
            return;
          }
        }

      

      res.status(200).json({ organization, contacts/* , contact */ });

    } catch (error) {
      console.error(error);
      
      res.status(500).end();
    }
  }
}