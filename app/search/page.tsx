"use client";

import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Spinner from "./Spinner";
import Organization from "../../components/Organization";
import Contact from "../../components/Contact";

const fetchOrganization = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

//data for csv

const SearchPage = () => {
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const router = useRouter();

  const encodedSearchQuery = encodeURI(searchQuery || "");

  const { data, isLoading } = useSWR(
    `/api/search?q=${encodedSearchQuery}`,
    fetchOrganization,
    { revalidateOnFocus: false }
  );

  if (!encodedSearchQuery) {
    router.push("/");
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (!data.organization && !data.contact) {
    return null;
  }
  console.log(data);

  if (data.organization.length !== 0 || data.contact.length !== 0 ) {
    
    return (
      <>
        <span className="text-xl">
          Showing results for:{" "}
          <span className="font-semibold">{searchQuery}</span>
        </span>
        <Organization organization={data.organization} />
        <p>Contacts results for: {searchQuery}</p>
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