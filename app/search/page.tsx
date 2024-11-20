"use client";

import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Spinner from "../../components/Spinner";
import Organization from "../../components/Organization";
import Contact from "../../components/Contact";
import { Building, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";

const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

const SearchPage = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const searchQuery = searchParams?.get("q");
  const userId = session?.user.id;

  // Build the query string with all parameters
  const queryString = useCallback(() => {
    if (!searchParams) return "";
    const params = new URLSearchParams(searchParams);
    if (userId) {
      params.set("userId", userId);
    }
    return params.toString();
  }, [searchParams, userId]);

  const { data, error, isLoading } = useSWR(
    searchQuery ? `/api/search?${queryString()}` : null,
    fetchData,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (!searchQuery) {
      router.push("/");
    }
  }, [searchQuery, router]);

  if (!session || !session.user) {
    return null;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (!data) {
    return null;
  }

  if (data.contact) {
    return <Contact contact={data.contact} />;
  }

  if (data.organization?.length === 0 && data.contacts?.length === 0) {
    return (
      <span className="text-xl">
        <span className="font-semibold">Nothing Found</span>
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {data.organization?.length > 0 && (
        <div>
          <span className="text-xl flex items-center gap-2 mb-4">
            <Building className="h-5 w-5" /> 
            Organizations matching: <span className="font-semibold">{searchQuery}</span>
          </span>
          <Organization 
            organization={data.organization} 
            totalPages={1} 
            currentPage={1}
          />
        </div>
      )}
      
      {data.contacts?.length > 0 && (
        <div>
          <span className="text-xl flex items-center gap-2 mb-4">
            <UserRound className="h-5 w-5" /> 
            Contacts matching: <span className="font-semibold">{searchQuery}</span>
          </span>
          <Contact contact={data.contacts} />
        </div>
      )}
    </div>
  );
};

export default SearchPage;