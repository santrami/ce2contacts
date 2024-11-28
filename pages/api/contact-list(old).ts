import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

type Contact = {
  id: number;
  name: string;
  email: string;
  organizationId: number | null;
  projectParticipation: boolean;
  sectorId: number | null;
  termsId: number | null;
  userId: number | null;
  country: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const contacts = await prisma.contact.findMany({
        include: {
          organization: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      });
      
      // Transform the data to include tags in a more manageable format
      const transformedContacts = contacts.map(contact => ({
        ...contact,
        tags: contact.tags.map(t => ({
          id: t.tag.id,
          name: t.tag.name,
          color: t.tag.color
        }))
      }));

      res.status(200).json({ contact: transformedContacts });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}