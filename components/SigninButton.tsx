import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import ce2Logo from "@/public/images/climateurope_white.png";


function SigninButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    
    return (
      <div className="flex justify-between items-center bg-slate-800 w-full">
        <div className="flex items-center"> {/* First child aligned to the left */}
          <Link href={"/"}>
            <Image src={ce2Logo} alt="whatever" width={320} />
          </Link>
        </div>
        <div className="flex gap-3 items-center justify-end"> {/* Rest of the children aligned to the right */}
          <p className="text-sky-600">Welcome</p>
          <Link href={`/profile/${session.user.id}`}>
            <span className="hover:underline">{session.user.username}</span>
          </Link>
          <Button onClick={() => signOut()} variant="destructive">
            Sign Out
          </Button>
        </div>
      </div>
    );
    
  }
  /* return (
    <>
      <Button
        onClick={async () =>
          await signIn("undefined", {
            callbackUrl: "http://localhost:3000/game",
          })
        }
        variant="default"
      >
        Sign In
      </Button>
      <Link href="/register">
        <Button>Register</Button>
      </Link>
    </>
  ); */
}

export default SigninButton;