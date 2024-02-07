import prisma from "@/lib/prismadb";
import Institutes from "../Institutes";

export default async function Home() {
  const organization = await prisma.organization.findMany();

  return <Institutes organization={organization} />;
}