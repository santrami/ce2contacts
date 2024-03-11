import prisma from "@/lib/prismadb";
import Organization from "../../components/Organization";

export default async function Home() {
  const organization = await prisma.organization.findMany();

  // return <Institutes organization={organization} />;
  return (
    <div>
      <Organization organization={organization} />
    </div>
  )
}