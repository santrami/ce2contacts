
import Contact from "../Contact"
import prisma from "@/lib/prismadb";
import {contact, organization} from '@prisma/client'



async function page() {
  const contact = await prisma.contact.findMany({
    include: {
      organization: true,
    },
  });
  console.log(contact);
  
  return (
        // <Contact contact={contact}/>
        <h1>hu</h1>
  )
}

export default page