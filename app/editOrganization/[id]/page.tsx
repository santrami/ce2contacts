"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "next/navigation";
import "react-toastify/ReactToastify.min.css";
import EditOrganizationForm from "@/components/EditOrganizationForm";

interface OrganizationData {
  acronym: string;
  fullName: string;
  regionalName: string;
  website: string;
  country: string;
}

function Page() {
  const { data: session } = useSession();
  const [error, setError] = useState(null);
  const [organization, setOrganization] = useState<OrganizationData>();

  const params = useParams();

  useEffect(() => {
    const organization = async () => {
      const response = await fetch(`/api/organization/${params!.id}`);
      const data = await response.json();
      const { id, ...org } = data;

      setOrganization(org);
    };
    organization();
  }, [params]);

  const handleEditOrganization = async (editOrganization: OrganizationData) => {
    try {
      const response = await fetch(`/api/organization/${params!.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editOrganization),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Obtén los datos de error del servidor
        console.log(errorData);
        throw new Error(errorData.error.meta.target); // Lanza un error con el mensaje del servidor
      } else {
        toast.success("organization updated successfully");
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
          <EditOrganizationForm
            organization={organization}
            onEditOrganization={handleEditOrganization}
          />
          <Link href={"/"}>
            <Button variant={"mystyle"}>Back</Button>
          </Link>
        </div>
      </>
    );
  }
}

export default Page;
