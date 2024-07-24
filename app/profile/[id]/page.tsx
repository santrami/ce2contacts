"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState} from "react";
import EditProfileForm from "@/components/EditProfileForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

interface UserData {
  name: string;
  email: string;
}

function Page() {
  const { data: session } = useSession();
  const [error, setError] = useState(null);

  const handleCreateContact = async (updateUser: UserData) => {
    try {
      const response = await fetch(`/api/user/${session?.user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateUser),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Obtén los datos de error del servidor
        console.log(errorData);
        throw new Error(errorData.error.meta.target); // Lanza un error con el mensaje del servidor
      } else {
        console.log("New contact created", updateUser);
        toast.success("User updated successfully");
      }
    } catch (error: any) {
      console.log(error);
      setError(error.message);
      toast.error(`${error.message} already exists, try another one`);
    }
  };

/*   const [data, setData] = useState(null);
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
              onEditProfile={handleCreateContact}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Page;
