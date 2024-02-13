"use client"
import NewContactForm from '../../components/ui/NewContactForm';

interface ContactData {
    name: string;
    email: string;
    organizationId: number;
    projectParticipation: boolean;
    isActive: boolean;
}

const NewContactPage: React.FC = () => {
    const handleCreateContact = async (newContact: ContactData) => {
        try {
            const response = await fetch('/api/newContact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newContact),
            });

            if (!response.ok) {
                throw new Error('Error al crear el contacto');
            }

            console.log('Nuevo contacto creado:', newContact);
            // Aquí puedes realizar cualquier acción adicional después de crear el contacto
        } catch (error) {
            console.error('Error al crear el contacto:', error);
            // Aquí puedes manejar el error de manera apropiada
        }
    };

    return (
        <div>
            <h1>Nuevo Contacto</h1>
            <NewContactForm onCreateContact={handleCreateContact} />
        </div>
    );
};

export default NewContactPage;
