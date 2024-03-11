//this endpoint is used for sending contact by id and their events to contact details

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ mensaje: 'invalid ID param' });
  }

  if (req.method === "GET") {
    try {
      const contact = await prisma.contact.findUniqueOrThrow({
        where: {
          id: parseInt(id),
        },
        include: {
          participation: true,
          organization:true
        },
      });

      if (!contact) {
        return res.status(404).json({ message: "Organization not found" });
      }

      res.status(200).json(contact);
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
}
