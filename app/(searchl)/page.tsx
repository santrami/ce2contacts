"use client";

import Organization from "@/components/Organization";
import Contact from "@/components/Contact";
import { Suspense, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from 'next/navigation';
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { FileX2 } from "lucide-react";
import { CSVLink } from "react-csv";
import Spinner from "@/components/Spinner";

const fetchData = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    if (!text) {
      throw new Error('Empty response received');
    }

    try {
      const data = JSON.parse(text);
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      return data;
    } catch (e) {
      console.error('Failed to parse JSON:', text);
      throw new Error('Invalid JSON response');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default function Home() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  const page = parseInt(searchParams?.get('page') || '1');
  const sectorFilter = searchParams?.get('sector');
  const tagsFilter = searchParams?.get('tags');

  const endpoint = (sectorFilter || tagsFilter)
    ? `/api/search?${searchParams?.toString() || ''}`
    : `/api/organization?${searchParams?.toString() || ''}`;

  const { data, error } = useSWR(
    endpoint,
    fetchData,
    { 
      revalidateOnFocus: false,
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
      shouldRetryOnError: true,
      retryCount: 3,
      dedupingInterval: 5000
    }
  );

  if (error) {
    console.error('Error loading data:', error);
    return (
      <div className="flex justify-center">
        <div className="text-red-500 p-4 rounded-lg bg-red-100 border border-red-300">
          {error.message || 'Failed to load data'}. Please try refreshing the page.
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

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

  // Calculate counts for filtered results
  const counts = {
    contacts: data.contacts?.length || 0,
    organizations: (sectorFilter || tagsFilter) ? (data.organization?.length || 0) : (data.organizations?.length || 0),
    total: (data.contacts?.length || 0) + ((sectorFilter || tagsFilter) ? (data.organization?.length || 0) : (data.organizations?.length || 0))
  };

  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold mb-6">Climateurope2 Dashboard</h1>
        <ToastContainer />

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Search Results</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-400">Contacts</p>
              <p className="text-2xl font-bold">{counts.contacts}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Organizations</p>
              <p className="text-2xl font-bold">{counts.organizations}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-2xl font-bold">{counts.total}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {(sectorFilter || tagsFilter) ? (
            <>
              {data.contacts && data.contacts.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Contacts</h2>
                    <Button variant="outline">
                      <CSVLink
                        data={prepareCSVData(data.contacts)}
                        filename="filtered-contacts.csv"
                        className="flex items-center gap-2 text-gray-800"
                      >
                        <FileX2 className="h-4 w-4" />
                        Download Contacts
                      </CSVLink>
                    </Button>
                  </div>
                  <Contact contact={data.contacts} />
                </div>
              )}

              {/* {data.organization && data.organization.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Organizations</h2>
                  <Organization 
                    organization={data.organization}
                    totalPages={1}
                    currentPage={1}
                  />
                </div>
              )} */}

              {(!data.contacts?.length && !data.organization?.length) && (
                <div className="text-center p-4">No results found</div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">Organisation List</h2>
              {data.organizations && data.organizations.length > 0 ? (
                <Organization 
                  organization={data.organizations} 
                  totalPages={data.totalPages} 
                  currentPage={data.currentPage} 
                />
              ) : (
                <div className="text-center p-4">No organizations found</div>
              )}
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}