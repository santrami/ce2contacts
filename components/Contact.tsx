import { Button } from "@/components/ui/button";
import Link from "next/link";
import favicon from "@/public/images/favicon.png";
import Image from "next/image";
import Tooltip from "@/components/Tooltip";

interface Organization {
  fullName: string;
}

interface ContactProps {
  contact:
    | {
        id: number;
        name: string;
        email: string;
        organizationId: number;
        projectParticipation: boolean;
        organization: Organization;
        isActive: boolean;
      }
    | Array<{
        id: number;
        name: string;
        email: string;
        organizationId: number;
        projectParticipation: boolean;
        organization: Organization;
        isActive: boolean;
      }>;
}
const Contact: React.FC<ContactProps> = ({ contact }) => {
  if (Array.isArray(contact)) {
    // if array, map and render each element
    return (
      <>
        {contact.map((contact) => (
          <div
            key={contact.id}
            className="lg:flex lg:justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-full"
          >
            <div className="flex flex-col gap-2">
              <span className="flex text-xl font-semibold">
                {contact.projectParticipation && (
                  <>
                  <Tooltip message="CE2 participant">
                    <Image
                      className="inline self-center"
                      src={favicon}
                      alt="ce2 favicon"
                      width={19}
                      height={19}
                    />
                    </Tooltip>
                    &nbsp;
                  </>
                )}
                {contact.name}
              </span>

              {contact.email}
              <span className="text-xs font-semibold"></span>
              <span className="text-xs font-semibold">
                {contact.organization.fullName}
              </span>
            </div>
            <div className="flex gap-2">
              <Link href={`/contacts/${contact.id}`}>
                <Button variant={"secondary"}>See Activity</Button>
              </Link>
              <Link href={`/editContact/${contact.id}`}>
                <Button variant={"secondary"}>Edit Contact</Button>
              </Link>
            </div>
          </div>
        ))}
      </>
    );
  } else {
    // if object, just render it
    return (
      <div
        key={contact.id}
        className="lg:flex lg:justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-full lg:w-2/3"
      >
        <div className="flex flex-col gap-2">
          <span className="flex text-xl font-semibold">
            {contact.projectParticipation && (
              <>
                <Image
                  className="inline self-center"
                  src={favicon}
                  alt="ce2 favicon"
                  width={19}
                  height={19}
                />
                &nbsp;
              </>
            )}
            {contact.name}
          </span>
          {contact.email}
          <span className="text-xs font-semibold">
            {contact.projectParticipation}
          </span>
        </div>
        <div className="flex gap-2">
          <Link href={`/contacts/${contact.id}`}>
            <Button variant={"secondary"}>See Activity</Button>
          </Link>
          <Link href={`/editContact/${contact.id}`}>
            <Button variant={"secondary"}>Edit Contact</Button>
          </Link>
        </div>
      </div>
    );
  }
};

export default Contact;
