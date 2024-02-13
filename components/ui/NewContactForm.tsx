import React, { useState } from 'react';

interface ContactData {
  name: string;
  email: string;
  organizationId: number;
  projectParticipation: boolean;
  isActive: boolean;
}

interface NewContactFormProps {
    onCreateContact: (newContact: ContactData) => void;
}

const NewContactForm: React.FC<NewContactFormProps> = ({ onCreateContact }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [projectParticipation, setProjectParticipation] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar los datos del formulario

        // Crear el nuevo contacto
        const newContact: ContactData = {
            name,
            email,
            organizationId: 0, // Puedes ajustar esto según tu lógica
            projectParticipation,
            isActive: true, // Por defecto, el nuevo contacto está activo
        };

        // Llamar a la función de callback para pasar el nuevo contacto al componente padre
        onCreateContact(newContact);

        // Limpiar el formulario después de crear el contacto
        setName('');
        setEmail('');
        setProjectParticipation(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Nombre:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Correo electrónico:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={projectParticipation}
                        onChange={(e) => setProjectParticipation(e.target.checked)}
                    />
                    Participación en proyectos
                </label>
            </div>
            <button type="submit">Crear contacto</button>
        </form>
    );
};

export default NewContactForm;
