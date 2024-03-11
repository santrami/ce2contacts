"use client"
import useSWR from "swr";
import Spinner from "@/app/search/Spinner";
import ContactDetails from "@/components/ContactDetails";

interface Participation {
  id: number;
  contactId:number,
  organizationId: number;
  eventId: number;
  registrationTime: Date;
  timeParticipation: number;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  projectParticipation: boolean;
  isActive: boolean;
  contact: Array<Participation>;
}

const fetchOrganization = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

export default function Page({params}: {
  params: {id:string}
}) 
{

  const { data, error, isLoading } = useSWR<Contact>(
    `/api/contacts?id=${params.id}`,
    fetchOrganization,
    { revalidateOnFocus: false, revalidateOnReconnect: false, shouldRetryOnError: false }
  );

  console.log("datos",data);
  

  if (error) return <div>Error loading organization</div>;
    
  if (isLoading) return <div className="flex h-screen justify-center items-center"> <Spinner /> </div>
  

  return <ContactDetails contact={data} />;
};

