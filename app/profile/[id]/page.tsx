"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EditProfileForm from "@/components/EditProfileForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface UserData {
  name: string;
  email: string;
}

type queries = {
  query: string;
  id: string;
};

function Page() {
  const { data: session } = useSession();
  const [error, setError] = useState(null);
  const [data, setData] = useState<queries[]>([]);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const params = useParams();

  const handleEditProfile = async (updateUser: UserData) => {
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/queries/${params?.id}`);
      const data = await response.json();
      setData(data);
      console.log(data);
    };

    fetchData();
  }, []);

  if (session && session.user) {
    console.log(session.user);

    return (
      <>
        <div className="grid">
          <ToastContainer />
          <div className="flex flex-col justify-center items-center gap-3">
            <p className="text-2xl">{session.user.username}</p>
            <p>{session.user.email}</p>
            <p>{session.user.role}</p>

            <Button onClick={() => setVisible(!visible)} variant={"mystyle"}>
              Edit Profile
            </Button>
          </div>
          {visible && (
            <div className={`${visible ? 'opacity-100' : 'opacity-0'}`}>
              <EditProfileForm onEditProfile={handleEditProfile} />
            </div>
          )}
        </div>
        <h2 className="flex flex-col flex-wrap text-4xl">my queries</h2>
        <div className="flex flex-wrap gap-3">
          {data.map((query) => {
            return (
              <div key={query.id} className="flex flex-col gap-3">
                <p>{query.query}</p>
              </div>
            );
          })}
        </div>
        <div className="flex items-end justify-center">
        <Button  onClick={() => router.push("/")} variant={"secondary"}>
          back
        </Button></div>
      </>
    );
  }
}

export default Page;
