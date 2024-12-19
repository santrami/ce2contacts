"use client";

import Organization from "@/components/Organization";
import Contact from "@/components/Contact";
import { Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { FileX2 } from "lucide-react";
import { CSVLink } from "react-csv";
import Spinner from "@/components/Spinner";
import { OrganizationContainer } from "@/components/OrganizationContainer";

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
  const query = searchParams?.get("q");
  const sector = searchParams?.get("sector");
  const tags = searchParams?.get("tags");

  // If there's a search query or filters, use search endpoint
  const endpoint = (query || sector || tags)
    ? `/api/search?${searchParams?.toString() || ''}`
    : null;

  const { data, error, isLoading } = useSWR(
    endpoint,
    endpoint ? fetchData : null,
    { 
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      retryCount: 3,
      dedupingInterval: 5000,
      fallbackData: { contacts: [], organizations: [] }
    }
  );

  if (error) {
    return (
      <div className="flex justify-center">
        <div className="text-red-500 p-4 rounded-lg bg-red-100 border border-red-300">
          {error.message || 'Failed to load data'}. Please try refreshing the page.
        </div>
      </div>
    );
  }

  // Show spinner while loading search results
  if (endpoint && isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  // If there's search data, show search results
  if (data) {
    const hasResults = (data.contacts?.length > 0 || data.organizations?.length > 0);
    
    if (!hasResults) {
      return <div className="text-center">No results found</div>;
    }

    return (
      <div className="flex flex-col gap-8">
        {/* Show contacts first */}
        {data.contacts?.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Contacts ({data.contacts.length})</h2>
              <Button variant="outline">
                <CSVLink
                  data={data.contacts.map(contact => ({
                    id: contact.id,
                    name: contact.name,
                    email: contact.email,
                    organization: contact.organization?.fullName || '',
                    sector: contact.sector?.name || '',
                    tags: contact.tags?.map(t => t.name).join(', ') || ''
                  }))}
                  filename="contacts.csv"
                  className="flex items-center gap-2"
                >
                  <FileX2 className="h-4 w-4" />
                  Download Contacts
                </CSVLink>
              </Button>
            </div>
            <Contact contact={data.contacts} />
          </div>
        )}

        {/* Show organizations second */}
        {data.organizations?.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Organizations ({data.organizations.length})</h2>
              <Button variant="outline">
                <CSVLink
                  data={data.organizations.map(org => ({
                    id: org.id,
                    name: org.fullName,
                    acronym: org.acronym || '',
                    website: org.website || '',
                    country: org.country || '',
                    contacts: org.contact?.length || 0,
                    tags: org.tags?.map(t => t.name).join(', ') || ''
                  }))}
                  filename="organizations.csv"
                  className="flex items-center gap-2"
                >
                  <FileX2 className="h-4 w-4" />
                  Download Organizations
                </CSVLink>
              </Button>
            </div>
            <Organization 
              organization={data.organizations} 
              totalPages={1} 
              currentPage={1}
            />
          </div>
        )}
      </div>
    );
  }

  // If no search or filters, show organization list
  return (
    <div className="flex flex-col gap-8">
      <OrganizationContainer />
    </div>
  );
}