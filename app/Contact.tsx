import { Button } from "@/components/ui/button";
import { contact, organization } from "@prisma/client";
import { CSVLink } from "react-csv";

interface contactProps {
  contact: Array<contact & { organization: organization }>;
}

const Contact = ({ contact }: contactProps) => {
  const headers = [
    "name",
    "email",
    "organizationFullName",
    "organizationAcronym",
    "projectParticipation",
  ];
  const csvdata = contact.map((c) => [
    c.name,
    c.email,
    c.organization.fullName,
    c.organization.acronym,
    c.projectParticipation,
  ]);

  return (
    <>
      <div><h1>Contacts</h1></div>
        <Button className="" variant={"outline"}>
        <CSVLink className="text-gray-800 self-end" data={csvdata} headers={headers} filename={"contacts"}>
          Download csv
        </CSVLink>
        </Button>
      
      {contact.map((contact, index) => (
        <div
          key={index}
          className="flex justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-3/4"
        >
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold">{contact.name}</span>
            <a
              href={contact.email}
              target="_blank"
              className="text-xs font-semibold"
            >
              {contact.email}
            </a>
            <span className="text-xs font-semibold">
              {contact.organization.fullName}
            </span>
            <span className="text-xs font-semibold">
              {contact.organization.acronym}
            </span>
            <span className="text-xs font-semibold">
              {contact.projectParticipation}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default Contact;
