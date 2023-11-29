import { INSTITUTES } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/lib/prismadb'

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
       * Search posts
       */
      const institutes: Array<INSTITUTES> = await prisma.iNSTITUTES.findMany({
        where: {           
              full_name: {
                contains: query,
                //mode: "insensitive",
              },
            },        
        },
        
      );

      /**
       * Save search
       */
      /* await prisma.searchQuery.create({
        data: {
          query,
        },
      }); */

      res.status(200).json({ institutes });
    } catch (error: any) {
      console.log(error);
      res.status(500).end();
    }
  }
}