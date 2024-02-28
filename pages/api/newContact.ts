import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ContactData {
    id: number;
    name: string;
    email: string;
    organizationId: number;
    projectParticipation: boolean;
    isActive: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const newContactData: ContactData = req.body;
        try {
            const createdContact = await prisma.contact.create({
                data: {
                    ...newContactData,
                    organizationId: 2,
                    isActive:true
                }
            });
            console.log('Contacto creado:', createdContact);
            res.status(201).json(createdContact);
        } catch (error) {
            console.error('Error al crear el contacto:', error);
            res.status(500).json({ error: 'Error al crear el contacto' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
