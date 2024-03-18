"use client"
import { Button } from "@/components/ui/button";
import { ShieldOff } from "lucide-react";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter(); 
  return (
    <div  className="flex flex-col justify-center items-center h-screen gap-5">
      <ShieldOff className="h-24 w-24 mb-12 text-red-950" />
      <div>
        unauthorized: You don't have permission to see this page. Contact
        administrator if you need to create a user
      </div>
      <Button onClick={() => router.back()} variant={"secondary"}>back</Button>
    </div>
  );
}

export default page;
