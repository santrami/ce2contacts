import Link from "next/link";
import { Button } from "@/components/ui/button";
import { contact, organization } from "@prisma/client";

interface organizationProps {
  organization: Array<organization & { contact: contact }>;
}

interface organizationAloneProps {
  organization: Array<organization>;
}

const Organization = ({ organization }: organizationProps | organizationAloneProps) => {
  
  return (
    <>
      {organization.map((organization) => (
        <div key={organization.id} className="flex justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold">
              {organization.fullName}
            </span>
            <a
              href={organization.website}
              target="_blank"
              className="text-xs font-semibold"
            >
              {organization.website}
            </a>
            <span className="text-xs font-semibold">
              {organization.acronym}
            </span>
            <span className="text-xs font-semibold">
              {organization.country}
            </span>
          </div>
          <Link href={`/organizations/${organization.id}`}>
            <Button>Ver detalle</Button>
          </Link>
          
          {/* <Contact contact={organization.contact}/> 
          <div>{organization.contact.name}</div> */}


        </div>
      ))}
    </>
  );
};

export default Organization;