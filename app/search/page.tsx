"use client";

import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Spinner from "./Spinner";
import Institutes from "../Institutes";
import Contact from "../Contact";

const fetchInstitutes = async (url: string) => {
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
    fetchInstitutes,
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

 

  

  // return (
  //   <>
  //     <span className="text-xl">
  //       Showing results for:{" "}
  //       <span className="font-semibold">{searchQuery}</span>
  //     </span>
  //     <Institutes organization={data.organization} />
  //   </>
  // );

  if ((data.organization)) {
    return (
      <>
        <span className="text-xl">
          Showing results for:{" "}
          <span className="font-semibold">{searchQuery}</span>
        </span>
        <Institutes organization={data.organization} />
        <Contact contact={data.contact} />
      </>
    );
  } else if(data.contact){
    return (
      <>
        <span className="text-xl">
          Showing results for:{" "}
          <span className="font-semibold">{searchQuery}</span>
        </span>
        <Contact contact={data.contact} />
        {/* <Institutes organization={data.organization} /> */}
      </>
    );
  }

  
};

export default SearchPage;