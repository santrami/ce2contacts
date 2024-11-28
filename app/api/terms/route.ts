import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    const terms = await prisma.terms.findMany({
      orderBy: { id: 'asc' }
    });

    // If no terms exist, create default ones
    if (!terms || terms.length === 0) {
      const defaultTerms = {
        description: 'I agree to the terms and conditions of the Climateurope2 platform.'
      };

      await prisma.terms.create({
        data: defaultTerms
      });

      return NextResponse.json(await prisma.terms.findMany());
    }

    return NextResponse.json(terms);
  } catch (error) {
    console.error('Error fetching terms:', error);
    return NextResponse.json(
      { error: "Failed to fetch terms" },
      { status: 500 }
    );
  }
}