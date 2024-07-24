//this endpoint is used for sending organization by id and their contacts to organization details

import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const users = await prisma.user.findMany();

      return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({
            error: error.message,
        });
    }
}