"use client";
import Contact from "@/components/Contact";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import { FileX2 } from "lucide-react";
import Paginations from "@/components/Pagination";

interface Organization {
  fullName: string;
}

export default function Home() {
  const [contacts, setContacts] = useState<
    {
      id: number;
      name: string;
      email: string;
      organizationId: number;
      projectParticipation: boolean;
      organization: Organization;
      isActive: boolean;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const contactList = async () => {
    const contacts = await fetch("/api/contact-list");
    const res = await contacts.json();
    setContacts(res.contact);
  };

  const projectContacts = contacts.filter(
    (contact) => contact.projectParticipation === true
  );

  useEffect(() => {
    contactList();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  const headers = ["name", "email", "organizationFullName"];
  const csvdata = projectContacts.map((c) => [
    c.name,
    c.email,
    c.organization?.fullName,
  ]);

  return (
    <div className="self-center w-2/3">
      <div className="flex justify-center">
        <Button variant={"outline"}>
          <CSVLink
            className="text-gray-800"
            data={csvdata}
            headers={headers}
            filename={`project participants`}
          >
            <FileX2 className="inline-block" /> Download contacts
          </CSVLink>
        </Button>
      </div>
      <Contact contact={projectContacts} />
    </div>
  );
}