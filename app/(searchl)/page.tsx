"use client"
import Organization from "../../components/Organization";
import { useEffect, useState } from "react";

/* type OrganizationTable = {
  id: number;
  acronym: string | null;
  fullName: string;
  regionalName: string | null;
  website: string | null;
  country: string | null;
}

interface organizationAloneProps {
  organization: Array<OrganizationTable>;
}
 */
export default function Home() {

  const [orgs, setOrgs] = useState<
    {
      id: number;
      acronym: string;
      fullName: string;
      regionalName: string | null;
      website: string;
      country: string | null;
    }[]
  >([]);

  useEffect(() => {
    organization();
  }, []);

  const organization = async () => {
    const orgs = await fetch("/api/organizationList");
    const res = await orgs.json();
    console.log(res);
    

    setOrgs(res.organization);
    console.log(organization);
    
  };
  /* const organization = await prismadb.organization.findMany();
 */
  // return <Institutes organization={organization} />;
  return (
    <div>
      <Organization organization={orgs} />
    </div>
  )
}