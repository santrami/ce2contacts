"use client"
import { Button } from "@/components/ui/button";
import { ShieldOff } from "lucide-react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter(); 
  return (
    <div  className="flex flex-col justify-center items-center h-screen gap-5">
      <ShieldOff className="h-24 w-24 mb-12 text-red-950" />
      <div>
        unauthorized: You have no permission to see this page. Contact
        administrator if you need to create a user
      </div>
      <Button onClick={() => router.push("/")} variant={"secondary"}>back</Button>
    </div>
  );
}

export default Page;
