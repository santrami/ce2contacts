"use client";
import Organization from "@/components/Organization";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

export default function Home() {
  const [orgs, setOrgs] = useState<
    {
      id: number;
      acronym: string;
      fullName: string;
      regionalName: string | null;
      website: string;
      country: string | null;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const organization = async () => {
    const orgs = await fetch("/api/organizationList");
    const res = await orgs.json();
    setOrgs(res.organization);
  };

  useEffect(() => {
    organization();
      setIsLoading(false);
    
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <Organization organization={orgs} />
    </div>
  );
}