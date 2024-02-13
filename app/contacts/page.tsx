
import Contact from "../Contact"
import prisma from "@/lib/prismadb";

async function page() {
  const contact = await prisma.contact.findMany({
    include: {
      organization: true,
    },
  });
  //console.log(contact);
  
  return (
        <Contact contact={contact}/>
  )
}

export default page