import prismadb from "@/lib/prismadb";
import Organization from "../../components/Organization";

export default async function Home() {
  const organization = await prismadb.organization.findMany();

  // return <Institutes organization={organization} />;
  return (
    <div>
      <Organization organization={organization} />
    </div>
  )
}