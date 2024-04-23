"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchInput = () => {
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    /* search ? search.get("q") :  */""
  );
  const router = useRouter();
    
  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof searchQuery !== "string") {
      return;
    }

    const encodedSearchQuery = encodeURI(searchQuery);
    router.push(`/search?q=${encodedSearchQuery}`);
  };

  return (
    <form onSubmit={onSearch} className="flex justify-center w-2/3">
      <div className="relative inline-block w-screen">
        <input
          value={searchQuery || ""}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="px-5 py-1 sm:px-5 sm:py-3 flex-1 text-zinc-200 bg-zinc-800 focus:bg-black rounded-full focus:outline-none focus:ring-[1px]  placeholder:text-zinc-400 w-full"
          placeholder="Search institutions or contacts"
        />
        {searchQuery !== "" && <X onClick={()=> {setSearchQuery(""); router.push("/")} } style={{ position: "absolute", right: 10, top:10, cursor:"pointer", display:"inline-block" }} />}
      </div>
        <Button variant={"secondary"} onClick={onSearch} className="ml-2">search</Button>
    </form>
  );
};

export default SearchInput;
