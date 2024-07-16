//this endpoint allows to create new contact in DDBB 

import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

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
        console.log(newContactData)
        newContactData.organizationId = Number(newContactData.organizationId);
        try {
            const createdContact = await prismadb.contact.create({
                data: {
                    ...newContactData,
                    //organizationId was being sent as string, force to number
                    projectParticipation: true,
                    sectorId: 1,
                    termsId: 1,
                    /* organizationId: Number (newContactData?.organizationId), */
                }
            });
            res.status(201).json(createdContact);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
            
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
