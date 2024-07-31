"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type Contact = {
  id: number;
  name: string;
  email: string;
  organizationId: number | null;
  country: string | null;
  projectParticipation: boolean;
  termsId: number | null;
  sectorId: number | null;
  userId: number | null;
};

type OrganizationTable = {
  id: number;
  acronym: string | null;
  fullName: string;
  regionalName: string | null;
  website: string | null;
  country: string | null;
};

interface organizationAloneProps {
  organization: Array<OrganizationTable>;
}

interface organizationProps {
  organization: Array<OrganizationTable & { contact: Contact }>;
}

const Organization = ({
  organization,
}: organizationProps | organizationAloneProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 15;

  // Detect whether it is mobile or not
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Call the function once to detect the initial window size
    handleResize();

    // Subscribe for the resize event
    window.addEventListener("resize", handleResize);

    // Unsubscribe from the event when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = organization.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(organization.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
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
              href={organization.website || undefined}
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
          <div className="flex gap-2">
            <Link href={`/organizations/${organization.id}`}>
              <Button variant={"secondary"}>Contacts</Button>
            </Link>
            <Link href={`/editOrganization/${organization.id}`}>
              <Button variant={"secondary"}>Edit Organization</Button>
            </Link>
          </div>
        </div>
      ))}
      {totalPages > 1 && (
        <>
          {isMobile ? (
            <div className="flex justify-center items-center gap-7 text-gray-400 p-7 text-2xl">
              <Button
                variant="outline"
                className="text-black"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                first
              </Button>
              <Button
                variant="outline"
                className="text-black"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="text-black"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
              <Button
                variant="outline"
                className="text-black"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-2 text-gray-400 p-7 text-2xl">
              {[...Array(totalPages)].map((e, i) => (
                <button
                  className="hover:scale-150 transition-all focus:bg-gray-400 p-1 focus:text-slate-950 focus:rounded-full"
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Organization;
