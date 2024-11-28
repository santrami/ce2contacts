"use client";
import useSWR from "swr";
import Spinner from "@/components/Spinner";
import ContactDetails from "@/components/ContactDetails";

interface Activity {
  id: number;
  title: string;
  date: string;
  website?: string;
  activityType?: {
    name: string;
  } | null;
}

interface ActivityParticipation {
  id: number;
  activity: Activity;
  role?: string;
  attendance?: boolean;
}

interface Organization {
  id: number;
  acronym: string;
  fullName: string;
  regionalName: string;
  website: string;
  country: string;
}

interface Sector {
  id: number;
  name: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  projectParticipation: boolean;
  sector: Sector;
  organization: Organization;
  activityParticipation: Array<ActivityParticipation>;
}

const fetchContact = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch contact');
  }
  return response.json();
};

export default function Page({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR<Contact>(
    `/api/contact/${params.id}`,
    fetchContact,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  if (error) {
    console.error('Error loading contact:', error);
    return <div className="text-center p-4 text-red-500">Error loading contact: {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Spinner />
      </div>
    );
  }
    {/* @ts-ignore */}
  return <ContactDetails contact={data} />;
}