"use client";

import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Spinner from "./Spinner";
import Organization from "../../components/Organization";
import Contact from "../../components/Contact";
import { Building, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";

const fetchOrganization = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

//data for csv

const SearchPage = () => {
  const {data:session} = useSession()
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const router = useRouter();
  
  if(!session || !session.user){
    return null
  }

  const encodedSearchQuery = encodeURI(searchQuery || "");
  const userId = session!.user.id;
  

  const { data, isLoading } = useSWR(
    `/api/search?q=${encodedSearchQuery}&userId=${userId}`,
    fetchOrganization,
    { revalidateOnFocus: false }
  );
    console.log("a ver ome",data);
    
  if (!encodedSearchQuery) {
    router.push("/");
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (!data.organization && !data.contact) {
    return null;
  }

  if (data.organization.length !== 0 || data.contact.length !== 0 ) {
    
    return (
      <>
        <span className="text-xl">
        <Building className="inline-block" /> Showing results for:{" "}
          <span className="font-semibold">{searchQuery}</span>
        </span>
        <Organization organization={data.organization} />
        <p> <UserRound className="inline-block" /> Contacts results for: {searchQuery}</p>
        <Contact contact={data.contact} />
      </>
    );
  } else {
    return (
      <>
        <span className="text-xl">
          <span className="font-semibold">Nothing Found</span>
        </span>
      </>
    );
  }
};

export default SearchPage;