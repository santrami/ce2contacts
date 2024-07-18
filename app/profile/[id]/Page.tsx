"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SearchQuery } from "@prisma/client";
import EditProfileForm from "@/components/EditProfileForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

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

  useEffect(() => {
    organizations();
  }, []);

  const handleCreateContact = async (newContact: ContactData) => {
    try {
      const response = await fetch("/api/newContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Obtén los datos de error del servidor
        console.log(errorData);
        throw new Error(errorData.error.meta.target); // Lanza un error con el mensaje del servidor
      } else {
        console.log("New contact created", newContact);
        toast.success("New contact created");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      toast.error(`${error.message} already exists`);
    }
  };

  const organizations = async () => {
    const orgs = await fetch("/api/organizationList");
    const res = await orgs.json();

    setOrgs(res.organization);
  };

  /* const [data, setData] = useState(null);
    useEffect(() => {
      const fetchData = async () => {
          const response = await fetch('/api/queries');
          const data = await response.json();
          setData(data);
      };

      fetchData();
  }, []); */

  if (session && session.user) {
    console.log(session.user);

    return (
      <>
        <div className="grid grid-rows-2">
          <div className="flex flex-col justify-center items-center gap-3">
            <p className="text-2xl">{session.user.username}</p>
            <p>{session.user.email}</p>
            <p>{session.user.role}</p>
            <Link href={"/"}>
              <Button variant={"mystyle"}>Back</Button>
            </Link>
          </div>
          <div className="flex">
            <ToastContainer />
            <EditProfileForm
              organization={orgs}
              onEditProfile={handleCreateContact}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Page;
