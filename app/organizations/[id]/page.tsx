"use client";
import useSWR from "swr";
import OrganizationDetails from "@/components/OrganizationDetails";
import Spinner from "@/components/Spinner";

interface Contact {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  projectParticipation: boolean;
  isActive: boolean;
  organization:Organization
}

interface Organization {
  id: number;
  acronym: string;
  fullName: string;
  regionalName: string;
  website: string;
  country: string;
  contact: Array<Contact>;
}

const fetchOrganization = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

export default function Page({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR<Organization>(
    `/api/organizations?id=${params.id}`,
    fetchOrganization,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  if (error) return <div>Error loading organization</div>;

  if (isLoading)
    return (
      <div className="flex h-screen justify-center items-center">
        {" "}
        <Spinner />{" "}
      </div>
    );

  return (
    <>
      <OrganizationDetails organization={data} />
    </>
  );
}
