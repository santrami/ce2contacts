/* this endpoint allows to fetch organizations, it's used in newcontact form for select organization for new contact*/

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

type Contact = {
  id: number;
  name: string | null;
  email: string;
  organizationId: number | null;
  projectParticipation: boolean | null;
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
      const contact: Array<Contact> =
        await prisma.contact.findMany({
          include: {
            organization: true
          }
        });
      
      res.status(200).json({ contact });

    } catch (error: any) {
      res.status(500).end();
    }
  }
}