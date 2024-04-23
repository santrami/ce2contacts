import { Button } from "@/components/ui/button";
import Contact from "./Contact";
import { CSVLink } from "react-csv";
import Link from "next/link";
import { FileX2 } from "lucide-react";

interface Contacts {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  projectParticipation: boolean;
  isActive: boolean;
}

interface Organization {
  id: number;
  acronym: string;
  fullName: string;
  regionalName: string;
  website: string;
  country: string;
  contact: Array<Contacts>;
}

interface Props {
  organization: Organization | undefined;
}

function OrganizationDetails(organization: Props) {
  const headers = [
    "name",
    "email",
    "organizationFullName",
    "organizationAcronym",
    "projectParticipation",
  ];
  const csvdata = organization.organization!.contact.map((c) => [
    c.name,
    c.email,
    organization.organization?.fullName,
    organization.organization?.acronym,
    c.projectParticipation,
  ]);

  return (
    <>
      <div className="flex flex-col gap-10 items-center p-6">
      <div>
          <div>
            <Button variant={"secondary"}>
              <Link href="/">back to organizations</Link>
            </Button>
            
          </div>
        </div>
        <div
          key={organization.organization?.id}
          className="flex justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-3/4"
        >
          <div className="flex flex-col gap-2 w-full items-center bg-gray-800 lg:p-5">
            <span className="text-xl font-semibold">
              {organization.organization?.fullName}
            </span>
            <a
              href={organization.organization?.website}
              target="_blank"
              className="text-xs font-semibold"
            >
              {organization.organization?.website}
            </a>
            <span className="text-xs font-semibold">
              {organization.organization?.acronym}
            </span>
            <span className="text-xs font-semibold">
              {organization.organization?.country}
            </span>
          </div>
        </div>
        
        <div className="">
          <Button variant={"outline"}>
            <CSVLink
              className="text-gray-800"
              data={csvdata}
              headers={headers}
              filename={`contacts from ${organization.organization?.fullName}`}
            >
              <FileX2 className="inline-block"/> Download contacts 
            </CSVLink>
          </Button>
        </div>
        <h1 className="pt-5 flex justify-center items-center self-center">Contacts</h1>
        <div className="flex flex-col items-center lg:w-full">
          {organization.organization?.contact.map((contact) => (
            <Contact key={contact.id} contact={contact} />
          ))}
        </div>
      </div>
    </>
  );
}

export default OrganizationDetails;
