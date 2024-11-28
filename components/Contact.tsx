"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import favicon from "@/public/images/favicon.png";
import Image from "next/image";
import Tooltip from "@/components/Tooltip";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TagManager } from "@/components/TagManager";

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface Organization {
  fullName: string;
}

interface ContactProps {
  orgname?: string;
  contact:
    | {
        id: number;
        name: string;
        email: string;
        organizationId: number;
        projectParticipation: boolean;
        organization: Organization;
        sector?: { name: string };
        country?: string;
        tags?: Tag[];
      }
    | Array<{
        id: number;
        name: string;
        email: string;
        organizationId: number;
        projectParticipation: boolean;
        organization: Organization;
        sector?: { name: string };
        country?: string;
        tags?: Tag[];
      }>;
}

const Contact: React.FC<ContactProps> = ({ contact, orgname }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [contactTags, setContactTags] = useState<{ [key: number]: Tag[] }>({});

  useEffect(() => {
    // Initialize tags from props
    if (Array.isArray(contact)) {
      const tagsMap = contact.reduce((acc, c) => {
        acc[c.id] = c.tags || [];
        return acc;
      }, {});
      setContactTags(tagsMap);
    } else {
      setContactTags({ [contact.id]: contact.tags || [] });
    }
  }, [contact]);

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

  const handleTagsUpdate = async (contactId: number, updatedTags: Tag[]) => {
    try {
      // Update local state immediately for better UX
      setContactTags(prev => ({
        ...prev,
        [contactId]: updatedTags
      }));

      // Fetch the updated contact data to ensure we have the latest state
      const response = await fetch(`/api/contact/${contactId}`);
      if (!response.ok) {
        throw new Error('Failed to refresh contact data');
      }
      
      const updatedContact = await response.json();
      setContactTags(prev => ({
        ...prev,
        [contactId]: updatedContact.tags || []
      }));
    } catch (error) {
      console.error('Error updating tags:', error);
      toast.error('Failed to update tags');
    }
  };

  const renderContactCard = (contact: ContactProps['contact'] extends Array<infer T> ? T : ContactProps['contact']) => (
    <div
    /* @ts-ignore */
      key={contact.id}
      className="lg:flex lg:justify-between p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-full"
    >
      <div className="flex flex-col gap-2">
        {/* @ts-ignore */}
        <Button variant="outline" className="w-fit text-zinc-800" onClick={() => copyToClipboard(contact.id.toString())}>
          <Tooltip message="copy to clipboard">
            {/* @ts-ignore */}
            <span>{contact.id}</span>
          </Tooltip>
        </Button>
        <span className="flex text-xl font-semibold">
          {/* @ts-ignore */}
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
          {/* @ts-ignore */}
          {contact.name}
        </span>
        {/* @ts-ignore */}
        <span>{contact.email}</span>
        {/* @ts-ignore */}
        {contact.sector && (
          /* @ts-ignore */
          <span className="text-xs font-semibold">Sector: {contact.sector.name}</span>
        )}{/* @ts-ignore */}
        {contact.country && (
          /* @ts-ignore */
          <span className="text-xs font-semibold">Country: {contact.country}</span>
        )}
        <span className="text-xs font-semibold">
          {/* @ts-ignore */}
          Organization: {orgname || contact.organization?.fullName}
        </span>
        <TagManager
        /* @ts-ignore */
          entityId={contact.id}
          entityType="contact"
          /* @ts-ignore */
          initialTags={contactTags[contact.id] || []}
          /* @ts-ignore */
          onTagsUpdate={(tags) => handleTagsUpdate(contact.id, tags)}
        />
      </div>
      <div className="flex gap-2">
        {/* @ts-ignore */}
        <Link href={`/contacts/${contact.id}`}>
          <Button variant={"secondary"}>See Activity</Button>
        </Link>
        {/* @ts-ignore */}
        <Link href={`/editContact/${contact.id}`}>
          <Button variant={"secondary"}>Edit Contact</Button>
        </Link>
      </div>
    </div>
  );

  if (Array.isArray(contact)) {
    return (
      <>
        {contact.map((c) => renderContactCard(c))}
      </>
    );
  } else {
    return renderContactCard(contact);
  }
};

export default Contact;