import { organization} from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const organization: Array<organization> =
        await prisma.organization.findMany();
      
      res.status(200).json({ organization });

    } catch (error: any) {
      console.log(error);
      res.status(500).end();
    }
  }
}