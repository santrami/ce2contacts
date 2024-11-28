"use client";
import { useEffect, useState } from "react";
import NewContactForm from "@/components/NewContactForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ContactData {
  name: string;
  email: string;
  organizationId: number;
  projectParticipation: boolean;
  sectorId: number;
  country: string;
}

interface Organization {
  id: number;
  acronym: string;
  fullName: string;
  regionalName: string | null;
  website: string;
  country: string | null;
}

interface Sector {
  id: number;
  name: string;
}

const NewContactPage = () => {
  const { data: session } = useSession();
  const [error, setError] = useState(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgsResponse, sectorsResponse] = await Promise.all([
          fetch("/api/organizationList"),
          fetch("/api/sectors")
        ]);

        const orgsData = await orgsResponse.json();
        const sectorsData = await sectorsResponse.json();

        setOrganizations(orgsData.organization);
        setSectors(sectorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load required data");
      }
    };

    fetchData();
  }, []);

  const handleCreateContact = async (newContact: ContactData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create contact");
      }

      toast.success("Contact created successfully");
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      toast.error(error.message);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-16 min-w-full w-2/3">
      <ToastContainer />
      <NewContactForm
        organization={organizations}
        sectors={sectors}
        onCreateContact={handleCreateContact}
      />
      <Link style={{display:"flex",alignSelf:"center"}} href={"/"}>
          <Button variant={"default"}>Back</Button>
        </Link>
    </div>
  );
};

export default NewContactPage;