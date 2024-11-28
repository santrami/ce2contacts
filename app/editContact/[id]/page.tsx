"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EditContactForm from "@/components/EditContactForm";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import "react-toastify/ReactToastify.min.css";

interface ContactData {
  name: string;
  email: string;
  organizationId: number;
  country: string;
}

function Page() {
  const { data: session } = useSession();
  const [error, setError] = useState(null);
  const router = useRouter();
  const [orgs, setOrgs] = useState<
    {
      id: number;
      acronym: string;
      fullName: string;
      regionalName: string | null;
      website: string;
      country: string | null;
    }[]
  >([]);

  const params = useParams();

  useEffect(() => {
    organizations();
  }, []);

  const organizations = async () => {
    const orgs = await fetch("/api/organizationList");
    const res = await orgs.json();
    setOrgs(res.organization);
  };

  const handleEditContact = async (editContact: ContactData) => {
    try {
      const response = await fetch(`/api/contact/${params!.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editContact),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update contact');
      }

      toast.success("Contact updated successfully");
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      toast.error(error.message);
    }
  };

  if (session && session.user) {
    return (
      <>
        <div className="">
          <ToastContainer />
          <EditContactForm
            organization={orgs}
            onEditContact={handleEditContact}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <Button className="" variant={"secondary"} onClick={() => router.back()}>
            back to results
          </Button>
        </div>
      </>
    );
  }
}

export default Page;