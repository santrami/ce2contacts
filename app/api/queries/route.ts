
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const contacts = await prisma.searchQuery.findMany();

      return NextResponse.json(contacts);
    } catch (error) {
        return NextResponse.json({
            error: error.message,
        });
    }
}