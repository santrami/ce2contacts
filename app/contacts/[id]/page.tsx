"use client";
import useSWR from "swr";
import Spinner from "@/app/search/Spinner";
import ContactDetails from "@/components/ContactDetails";
import SigninButton from "@/components/SigninButton";

interface Event {
  name: string;
  internalID: number;
}

interface ParticipationProps {
  id: number;
  contactId: number;
  organizationId: number;
  eventId: number;
  registrationTime: string;
  timeParticipation: number;
  event: Event | undefined;
}

interface Organization {
  id: number;
  acronym: string;
  fullName: string;
  regionalName: string;
  website: string;
  country: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  projectParticipation: boolean;
  isActive: boolean;
  participation: Array<ParticipationProps>;
  organization: Organization;
}

const fetchOrganization = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

export default function Page({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR<Contact>(
    `/api/contacts?id=${params.id}`,
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
      <ContactDetails contact={data} />
    </>
  );
}
