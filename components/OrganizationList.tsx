import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TagManager } from "@/components/TagManager";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";

interface Organization {
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
}

interface OrganizationListProps {
  organizations: Organization[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onTagsUpdate: (organizationId: number, tags: any[]) => void;
}

export function OrganizationList({ 
  organizations, 
  totalPages, 
  currentPage,
  onPageChange,
  onTagsUpdate
}: OrganizationListProps) {
  if (!organizations?.length) {
    return <div className="text-center p-4">No organizations found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="min-h-[600px]">
        {organizations.map((organization) => (
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
                onTagsUpdate={(tags) => onTagsUpdate(organization.id, tags)}
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
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}