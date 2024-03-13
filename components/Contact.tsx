import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ContactProps {
  contact:
    | {
        id: number;
        name: string;
        email: string;
        organizationId: number;
        projectParticipation: boolean;
        isActive: boolean;
      }
    | Array<{
        id: number;
        name: string;
        email: string;
        organizationId: number;
        projectParticipation: boolean;
        isActive: boolean;
      }>;
}
const Contact: React.FC<ContactProps> = ({ contact }) => {
  if (Array.isArray(contact)) {
    // if array, map and render each element
    return (
      <>
        {contact.map((contact) => (
          <div key={contact.id} className="lg:flex lg:justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-full">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold">{contact.name}</span>
            {contact.email}
            <span className="text-xs font-semibold">
              {contact.projectParticipation}
            </span>
          </div>
            <Link href={`/contacts/${contact.id}`}>
              <Button variant={"secondary"}>See Activity</Button>
            </Link>
        </div>
        ))}
      </>
    );
  } else {
    // if object, just render it
    return (
      <div key={contact.id} className="lg:flex lg:justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-full lg:w-2/3">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-semibold">{contact.name}</span>
          {contact.email}
          <span className="text-xs font-semibold">
            {contact.projectParticipation}
          </span>
        </div>
          <Link href={`/contacts/${contact.id}`}>
            <Button variant={"secondary"}>See Activity</Button>
          </Link>
      </div>
    );
  }
};

export default Contact;
