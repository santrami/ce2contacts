"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { TagManager } from "@/components/TagManager";

type OrganizationTable = {
  id: number;
  acronym: string | null;
  fullName: string;
  regionalName: string | null;
  website: string | null;
  country: string | null;
  contact?: Array<any>;
  tags?: Array<{
    id: number;
    name: string;
    color: string;
  }>;
};

interface OrganizationProps {
  organization: OrganizationTable[];
  totalPages: number;
  currentPage: number;
}

const Organization = ({ organization, totalPages, currentPage }: OrganizationProps) => {
  const [organizations, setOrganizations] = useState(organization);
  const router = useRouter();

  useEffect(() => {
    setOrganizations(organization);
  }, [organization]);

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    
    // Use shallow routing to prevent full page reload
    router.push(url.pathname + url.search, { 
      scroll: false,
      /* @ts-ignore */
      shallow: true 
    });
  };

  const handleTagsUpdate = async (organizationId: number, updatedTags: any[]) => {
    try {
      // Update local state immediately for better UX
      setOrganizations(prevOrgs => 
        prevOrgs.map(org => 
          org.id === organizationId ? { ...org, tags: updatedTags } : org
        )
      );

      // Fetch the updated organization data to ensure we have the latest state
      const response = await fetch(`/api/organization/${organizationId}`);
      if (!response.ok) {
        throw new Error('Failed to refresh organization data');
      }
      
      const updatedOrg = await response.json();
      setOrganizations(prevOrgs =>
        prevOrgs.map(org =>
          org.id === organizationId ? { ...org, tags: updatedOrg.tags } : org
        )
      );
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="min-h-fit">
        {organizations?.map((organization) => (
          <div
            key={organization.id}
            className="lg:flex lg:justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-full"
          >
            <div className="flex items-center lg:items-start flex-col gap-2">
              <span className="text-xl font-semibold content-center">
                {organization.fullName}
              </span>
              {organization.website && (
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold hover:text-blue-400"
                >
                  {organization.website}
                </a>
              )}
              {organization.acronym && (
                <span className="text-xs font-semibold">
                  {organization.acronym}
                </span>
              )}
              {organization.country && (
                <span className="text-xs font-semibold">
                  {organization.country}
                </span>
              )}
              {organization.contact && (
                <span className="text-xs font-semibold">
                  Contacts: {organization.contact.length}
                </span>
              )}
              <TagManager
                entityId={organization.id}
                entityType="organization"
                initialTags={organization.tags || []}
                onTagsUpdate={(tags) => handleTagsUpdate(organization.id, tags)}
              />
            </div>
            <div className="flex justify-center gap-2 mt-2">
              <Link href={`/organizations/${organization.id}`}>
                <Button variant="secondary">View Details</Button>
              </Link>
              <Link href={`/editOrganization/${organization.id}`}>
                <Button variant="secondary">Edit Organization</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="sticky bottom-4 bg-[#021D61] py-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Organization;