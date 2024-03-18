/*import Link from "next/link";
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
          <div>{organization.contact.name}</div> */ /*}/*


        </div>
      ))}
    </>
  );
};

export default Organization;*/

"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { contact, organization } from "@prisma/client";
import { useState } from "react";

interface organizationProps {
  organization: Array<organization & { contact: contact }>;
}

interface organizationAloneProps {
  organization: Array<organization>;
}

const Organization = ({
  organization,
}: organizationProps | organizationAloneProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = organization.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(organization.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {currentItems.map((organization) => (
        <div
          key={organization.id}
          className="lg:flex lg:justify-between justify-center p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-full"
        >
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold content-center">
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
            <Button variant={"secondary"}>Contacts</Button>
          </Link>
        </div>
      ))}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-7 text-gray-400 p-7 text-2xl">
          {[...Array(totalPages)].map((e, i) => (
            <button className="hover:scale-150 transition-all focus:bg-gray-400 p-1 focus:text-slate-950 focus:rounded-full"
              key={i} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default Organization;
