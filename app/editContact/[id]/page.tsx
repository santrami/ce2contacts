"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EditContactForm from "@/components/EditContactForm";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "next/navigation";
import "react-toastify/ReactToastify.min.css";
import { useRouter } from "next/navigation";

interface ContactData {
  name: string;
  email: string;
  organizationId: number;
  projectParticipation: string;
  isActive: boolean;
}

function Page() {
  const { data: session } = useSession();
  const [error, setError] = useState(null);
  const router= useRouter();
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
        const errorData = await response.json(); // Obtén los datos de error del servidor
        console.log(errorData);
        throw new Error(errorData.error.meta.target); // Lanza un error con el mensaje del servidor
      } else {
        toast.success("Contact updated successfully");
      }
    } catch (error: any) {
      console.log(error);
      setError(error.message);
      toast.error(`${error.message} already exists, try another one`);
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
            <Button className="" variant={"secondary"} onClick={()=> router.back()}>
              back to results
            </Button>
          </div>
      </>
    );
  }
}

export default Page;