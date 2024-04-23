/* this endpoint allows to fetch organizations, it's used in newcontact form for select organization for new contact*/

import { Organization} from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const organization: Array<Organization> =
        await prisma.organization.findMany();
      
      res.status(200).json({ organization });

    } catch (error: any) {
      res.status(500).end();
    }
  }
}