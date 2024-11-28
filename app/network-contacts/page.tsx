"use client";

import Contact from "@/components/Contact";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { FileX2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

interface NetworkContact {
  id: number;
  name: string;
  email: string;
  organization: {
    fullName: string;
  };
  sector?: {
    name: string;
  };
  network: boolean;
}

export default function NetworkContacts() {
  const [contacts, setContacts] = useState<NetworkContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetworkContacts = async () => {
      try {
        const response = await fetch('/api/contacts/network');
        if (!response.ok) throw new Error('Failed to fetch network contacts');
        const data = await response.json();
        setContacts(data.contacts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkContacts();
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
        <h1 className="text-2xl font-bold">Network Contacts</h1>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="secondary">Back</Button>
          </Link>
          <Button variant="outline">
            <Link
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                [headers.join(","), ...csvdata.map(row => row.join(","))].join("\n")
              )}`}
              download="network-contacts.csv"
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
            /* @ts-ignore */
            <Contact contact={contacts} />
          ) : (
            <p className="text-center mt-4">No network contacts found</p>
          )}
        </Suspense>
      </div>
    </div>
  );
}