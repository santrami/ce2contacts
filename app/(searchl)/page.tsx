"use client";
import Organization from "@/components/Organization";
import Contact from "@/components/Contact";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from 'next/navigation';
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { FileX2 } from "lucide-react";
import { CSVLink } from "react-csv";

const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
};

export default function Home() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get current page from URL or default to 1
  const page = parseInt(searchParams?.get('page') || '1');
  
  // Check if sector filter is applied
  const sectorFilter = searchParams?.get('sector');

  // Determine which endpoint to use based on filters
  const endpoint = sectorFilter 
    ? `/api/search?sector=${sectorFilter}`
    : `/api/organization?${searchParams?.toString() || ''}`;

  // Fetch data with filters
  const { data, error } = useSWR(
    endpoint,
    fetchData,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  if (error) {
    return <div>Error loading data</div>;
  }

  if (isLoading || !data) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  // Prepare CSV data for contacts
  const prepareCSVData = (contacts) => {
    const headers = ["Name", "Email", "Organization", "Sector"];
    const csvData = contacts.map(contact => [
      contact.name,
      contact.email,
      contact.organization?.fullName || '',
      contact.sector?.name || ''
    ]);
    return [headers, ...csvData];
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold mb-6">Climateurope2 Dashboard</h1>
      <ToastContainer />

      <div className="mt-8">
        {sectorFilter && data.contacts ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Filtered Contacts</h2>
              {data.contacts.length > 0 && (
                <Button variant="outline">
                  <CSVLink
                    data={prepareCSVData(data.contacts)}
                    filename={`contacts-by-sector-${sectorFilter}.csv`}
                    className="flex items-center gap-2 text-gray-800"
                  >
                    <FileX2 className="h-4 w-4" />
                    Download Contacts
                  </CSVLink>
                </Button>
              )}
            </div>
            <Contact contact={data.contacts} />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Organization List</h2>
            <Organization 
              organization={data.organizations} 
              totalPages={data.totalPages} 
              currentPage={data.currentPage} 
            />
          </>
        )}
      </div>
    </div>
  );
}