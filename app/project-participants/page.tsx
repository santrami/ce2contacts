import Contact from "@/components/Contact";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { FileX2 } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prismadb";

async function getProjectParticipants() {
  const contacts = await prisma.contact.findMany({
    where: {
      projectParticipation: true
    },
    include: {
      organization: true,
      sector: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  return contacts.map(contact => ({
    ...contact,
    tags: contact.tags.map(t => ({
      id: t.tag.id,
      name: t.tag.name,
      color: t.tag.color
    }))
  }));
}

export default async function ProjectParticipants() {
  const contacts = await getProjectParticipants();

  const headers = ["name", "email", "organizationFullName"];
  const csvdata = contacts.map((c) => [
    c.name,
    c.email,
    c.organization?.fullName,
  ]);

  return (
    <div className="self-center w-2/3">
      <div className="flex justify-center gap-4">
        <Link href="/">
          <Button variant="secondary">back</Button>
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
      <div className="mt-6">
        <Suspense fallback={<div>Loading...</div>}>
          {contacts.length > 0 ? (
            /* @ts-ignore */
            <Contact contact={contacts} />
          ) : (
            <p className="text-center mt-4">No project participants found</p>
          )}
        </Suspense>
      </div>
    </div>
  );
}