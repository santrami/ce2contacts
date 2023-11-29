import prisma from "@/lib/prismadb";
import Institutes from "./Institutes";

export default async function Home() {
  const institutes = await prisma.iNSTITUTES.findMany();

  return <Institutes institutes={institutes} />;
}