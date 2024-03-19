"use client";
import { useEffect, useState } from "react";
import NewContactForm from "../../components/NewContactForm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ContactData {
  name: string;
  email: string;
  organizationId: number;
  projectParticipation: boolean;
  isActive: boolean;
}

const NewContactPage = () => {
    const [error, setError] = useState(null);
    const [orgs, setOrgs] = useState<{ id: number; acronym: string; fullName: string; regionalName: string | null; website: string; country: string | null; }[]>([]);

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
      }
      
      console.log("Nuevo contacto creado:", newContact);
      toast.success("Nuevo contacto creado:")
    } catch (error:any) {
      console.error(error);
      setError(error.message)
      toast.error(`${error.message} already exists`)
    }
  };

  const organizations = async ()=>{
    const orgs = await fetch("/api/organizationList")
    const res= await orgs.json()
    console.log(res);
    
    setOrgs(res.organization)
  }

  return (
    <div>
      <ToastContainer/>
      <NewContactForm organization={orgs} onCreateContact={handleCreateContact} />
    </div>
  );
};

export default NewContactPage;
