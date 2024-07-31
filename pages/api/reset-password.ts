import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import { sendPasswordResetEmail } from '@/lib/mail'
import { v4 as uuidv4 } from 'uuid'

interface ContactData {
    email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const newContactData: ContactData = req.body;   
        console.log(newContactData);
             
        try {
            const user = await prismadb.user.findUniqueOrThrow({
                where: {
                    email: newContactData.email
                }
            })
            if(user){
                const passwordResetToken = uuidv4();
                user.emailResetPassword = passwordResetToken
                const userUpdate= await prismadb.user.update({
                    where: {
                        email: newContactData.email
                    }, 
                    data: user
                })
                console.log(userUpdate);
                await sendPasswordResetEmail(newContactData.email, passwordResetToken);
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(401).json(error)
        }
    }
  
};