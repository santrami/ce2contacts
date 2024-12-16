"use client";
import { useEffect, useState } from "react";
import NewOrganizationForm from "@/components/NewOrganizationForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import "react-toastify/ReactToastify.min.css";

interface OrganizationData {
  acronym: string | null;
  fullName: string;
  regionalName: string | null;
  website: string | null;
  country: string | null;
}

const NewOrganizationPage = () => {
  const { data: session } = useSession();
  const [error, setError] = useState(null);

  const handleCreateContact = async (newOrganization: OrganizationData) => {
    try {
      const response = await fetch("/api/organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrganization),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Obtén los datos de error del servidor
        console.log(errorData);
        throw new Error(errorData.error.meta.target); // Lanza un error con el mensaje del servidor
      } else {
        toast.success("New organisation created");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      toast.error(`${error.message} already exists`);
    }
  };

  if (session && session.user) {
    return (
      <div className="flex flex-col gap-16 min-w-full w-2/3">
        <ToastContainer />
        <NewOrganizationForm
          onCreateOrganization={handleCreateContact}
        />
        <Link style={{display:"flex",alignSelf:"center"}} href={"/"}>
          <Button variant={"default"}>Back</Button>
        </Link>
      </div>
    );
  }
};

export default NewOrganizationPage;
