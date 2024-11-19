import { Button } from "@/components/ui/button";
import Link from "next/link";
import favicon from "@/public/images/favicon.png";
import Image from "next/image";
import Tooltip from "@/components/Tooltip";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Organization {
  fullName: string;
}

interface ContactProps {
  orgname: string | undefined;
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
const Contact: React.FC<ContactProps> = ({ contact, orgname }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
      toast.success("Id copied to clipboard", {
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (Array.isArray(contact)) {
    // if array, map and render each element
    
    
    return (
      <>
        <ToastContainer />
        {contact.map((contact) => (
          <div
            key={contact.id}
            className="lg:flex lg:justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-full"
          >
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-fit text-zinc-800" onClick={() => copyToClipboard(contact.id.toString())}>
                <Tooltip message="copy to clipboard">
                  <span>{contact.id}</span>
                </Tooltip>
              </Button>
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
      <>
        <ToastContainer />
        <div
          key={contact.id}
          className="lg:flex lg:justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-full"
        >
          <div className="flex flex-col gap-2">
            <Button className="w-fit text-zinc-800" variant="outline" onClick={() => copyToClipboard(contact.id.toString())}>
              <Tooltip message="copy to clipboard">
                <span>{contact.id}</span>
              </Tooltip>
            </Button>
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
              {orgname && orgname}
              {contact?.organization?.fullName}
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
      </>
    );
  }
};

export default Contact;

/* import React from 'react';
import Link from 'next/link';

interface ContactProps {
  contact: {
    id: number;
    name: string;
    email: string;
    country?: string;
    sector?: string;
    organization?: {
      id: number;
      name: string;
      acronym: string;
    };
  }[];
}

const Contact: React.FC<ContactProps> = ({ contact }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contact.map((c) => (
        <div key={c.id} className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold">{c.name}</h3>
          <p className="text-sm text-gray-600">{c.email}</p>
          {c.country && <p className="text-sm text-gray-600">Country: {c.country}</p>}
          {c.sector && <p className="text-sm text-gray-600">Sector: {c.sector}</p>}
          {c.organization && (
            <p className="text-sm text-gray-600">
              Organization: {c.organization.name} ({c.organization.acronym})
            </p>
          )}
          <Link href={`/contact/${c.id}`} className="text-blue-500 hover:underline mt-2 inline-block">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Contact; */
