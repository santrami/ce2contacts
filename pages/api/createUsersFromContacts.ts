// /pages/api/users/createFromContacts.js

import prisma from "@/lib/prismadb"; // Adjust based on your project's structure
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch contacts with projectParticipation true
    const contacts = await prisma.contact.findMany({
      where: {
        projectParticipation: true,
      },
    });

    // Iterate over contacts and create users
    for (const contact of contacts) {
      try {
        const username = `${contact.name}`.toLowerCase();
        const email = contact.email;
        const password = uuidv4();
        const hashPassword = await bcrypt.hash(password, 10);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              username: username,
              email: email,
              password: hashPassword,
              role: "user",
              contactId: contact.id,
            },
          });

          console.log(`User created for contact: ${contact.name}`);
        } else {
          console.log(`User already exists for contact: ${contact.name}`);
        }
      } catch (err) {
        console.error(`Error creating user for contact: ${contact.id}`, err);
      }
    }

    return res.status(200).json({ message: 'Users created successfully' });

  } catch (error) {
    console.error("Error fetching contacts with projectParticipation true:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
