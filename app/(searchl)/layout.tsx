"use client";

import Link from "next/link";
import "../globals.css";
import SearchInput from "../SearchInput";
import { FilterPanel } from "@/components/FilterPanel";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface FilterData {
  sectors: Array<{ id: number; name: string }>;
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filterData, setFilterData] = useState<FilterData>({
    sectors: []
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await fetch('/api/filters');
        const data = await response.json();
        setFilterData(data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  return (
    <div className="flex flex-col gap-10 items-center pt-0 mt-3">
      <div className="flex gap-5">
        <Link href="/newContact">
          <Button variant={"secondary"}>Create contact</Button>
        </Link>
        <Link href="/newOrganization">
          <Button variant={"secondary"}>Create organization</Button>
        </Link>
        <Link href="/project-participants">
          <Button variant={"ce2"}>Project participant list</Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchInput />
      </Suspense>
      {!isLoading && (
        <FilterPanel 
          sectors={filterData.sectors}
        />
      )}
      <div className="lg:w-2/3 w-full p-5">{children}</div>
    </div>
  );
}