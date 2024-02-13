import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ mensaje: 'El parámetro ID es inválido' });
  }

  if (req.method === "GET") {
    try {
      const organization = await prisma.organization.findUniqueOrThrow({
        where: {
          id: parseInt(id),
        },
        include: {
          contact: true,
        },
      });

      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      res.status(200).json(organization);
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
}
