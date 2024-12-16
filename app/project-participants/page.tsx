"use client";

import Contact from "@/components/Contact";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileX2 } from "lucide-react";
import Link from "next/link";
import Spinner from "@/components/Spinner";

interface Organization {
  id: number;
  fullName: string;
  acronym?: string;
  regionalName?: string;
  website?: string;
  country?: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface ProjectParticipant {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  projectParticipation: boolean;
  organization: Organization;
  sector?: {
    name: string;
  };
  country?: string;
  tags?: Tag[];
}

export default function ProjectParticipants() {
  const [contacts, setContacts] = useState<ProjectParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectParticipants = async () => {
      try {
        const response = await fetch('/api/projectParticipant');
        if (!response.ok) throw new Error('Failed to fetch project participants');
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectParticipants();
  }, []);

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  const headers = ["name", "email", "organizationFullName"];
  const csvdata = contacts.map((c) => [
    c.name,
    c.email,
    c.organization?.fullName,
  ]);

  return (
    <div className="self-center w-2/3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Participants</h1>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="secondary">Back</Button>
          </Link>
          <Button variant="outline">
            <Link
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                [headers.join(","), ...csvdata.map(row => row.join(","))].join("\n")
              )}`}
              download="project-participants.csv"
              className="text-gray-800"
            >
              <FileX2 className="inline-block mr-2" /> Download contacts
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <Suspense fallback={<div>Loading...</div>}>
          {contacts.length > 0 ? (
            <Contact contact={contacts} />
          ) : (
            <p className="text-center mt-4">No project participants found</p>
          )}
        </Suspense>
      </div>
    </div>
  );
}