"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    searchParams ? searchParams.get("q") : ""
  );
  const router = useRouter();
    
  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof searchQuery !== "string" || !searchQuery.trim()) {
      return;
    }

    // When searching, only use the search query parameter
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    // When clearing search, go back to root without any parameters
    router.push("/");
  };

  return (
    <form onSubmit={onSearch} className="flex mt-4 justify-center w-2/3">
      <div className="relative inline-block w-screen">
        <input
          value={searchQuery || ""}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="px-5 py-1 sm:px-5 sm:py-3 flex-1 text-zinc-800 bg-slate-100 rounded-full focus:outline-none focus:ring-[1px] placeholder:text-zinc-400 w-full"
          placeholder="Search institutions or contacts"
        />
        {searchQuery && (
          <X 
            color="black" 
            onClick={clearSearch} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" 
          />
        )}
      </div>
      <Button variant={"secondary"} onClick={onSearch} className="ml-2">
        search
      </Button>
    </form>
  );
};

export default SearchInput;