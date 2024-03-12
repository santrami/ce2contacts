import { Button } from "@/components/ui/button";
import Contact from "@/components/Contact";
import { CSVLink } from "react-csv";
import Link from "next/link";
import Participation from "@/components/Participation";

interface Event {
  name: string;
  internalID: number;
}

interface ParticipationProps {
  id: number;
  contactId: number;
  organizationId: number;
  eventId: number;
  registrationTime: string;
  timeParticipation: number;
  event: Event | undefined;
}

interface Organization {
  id: number;
  acronym: string;
  fullName: string;
  regionalName: string;
  website: string;
  country: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  projectParticipation: boolean;
  isActive: boolean;
  participation: Array<ParticipationProps>;
  organization: Organization;
}

interface Props {
  contact: Contact | undefined;
}

function ContactDetails(contact: Props) {
  const headers = [
    "name",
    "email",
    "organizationFullName",
    "organizationAcronym",
    "projectParticipation",
  ];
  /*   const csvdata = contact.contact?.contact.map((c) => [
    c.name,
    c.email,
    contact.contact?.fullName,
    contact.contact?.acronym,
    c.projectParticipation,
  ]); */
  console.log("datos de contacto y participacion", contact);

  return (
    <>
      <div className="flex flex-col gap-10 items-center p-6">
        <div
          key={contact.contact?.id}
          className="flex justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-3/4"
        >
          <div className="flex flex-col gap-2 w-full items-center bg-gray-800 p-5">
            <span className="text-xl font-semibold">
              {contact.contact?.name}
            </span>

            <span className="text-xs font-semibold">
              {contact.contact?.email}
            </span>
            <span className="text-xs font-semibold">
              {contact.contact?.organization.fullName}
            </span>
          </div>
        </div>
        <div>
          <div>
            <Button>
              <Link href="/">Volver</Link>
            </Button>
            <h1>Participation in events</h1>
          </div>
        </div>
        {/* <div className="">
        <Button  variant={"outline"}>
          <CSVLink className="text-gray-800" data={csvdata} headers={headers} filename={`contacts from ${contact.contact?.acronym}`} >
            Download csv
          </CSVLink>
        </Button>
        </div> */}
        <div className="w-3/4">
          {contact.contact?.participation && contact.contact.participation.length > 0 ? (
            contact.contact.participation.map((participation, index) => (
              <Participation
                key={index}
                id={participation.id}
                organization={contact.contact?.organization.fullName}
                registrationTime={participation.registrationTime}
                timeParticipation={participation.timeParticipation}
                event={participation.event?.name}
              />
            ))
          ) : (
            <div className="flex justify-center items-center text-slate-300 text-2xl">No activity found</div>
          )}
        </div>
      </div>
    </>
  );
}

export default ContactDetails;
