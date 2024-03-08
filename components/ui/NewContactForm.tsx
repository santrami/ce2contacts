import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';

interface FormValues {
    name: string;
    email: string;
    organizationId: number;
    projectParticipation: boolean;
    isActive: boolean;
  }

  type NewContactFormProps = {
    organization: { 
      id: number; 
      acronym: string; 
      fullName: string; 
      regionalName: string | null; 
      website: string; 
      country: string | null; 
    }[];
    onCreateContact: (newContact: FormValues) => Promise<void>;
  };

const NewContactForm: React.FC<NewContactFormProps> = ({ organization, onCreateContact }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [projectParticipation, setProjectParticipation] = useState(false);
    

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        

        // Validar los datos del formulario

        // Crear el nuevo contacto
        const newContact: FormValues = {
            name:data.name,
            email:data.email,
            organizationId: data.organizationId,
            projectParticipation:data.projectParticipation,
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
        <div className="bg-slate-800 h-[calc(100vh)] flex justify-center items-center">
          <form className="w-fit p-6" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name" className="text-slate-500 mb-2 block text-sm">
              Complete Name:
            </label>
            <input
              type="text"
              {...register("name", {
                required: {
                  value: true,
                  message: "Name required",
                },
              })}
              className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
              placeholder="Name"
            />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
    
            <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
              email:
            </label>
            <input
              type="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email required",
                },
              })}
              className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
              placeholder="email"
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
    
            <label className="text-slate-500 mb-2 block text-sm">
              is CE2 Participant:
            </label>
            <input
              type="checkbox"
              {...register("projectParticipation")}
              className="p-3 rounded-lg block w-10 h-10 mb-2 accent-red-300  w-full"
            />

            <label htmlFor="organizationId" className="text-slate-500 mb-2 block text-sm">
              Organización:
            </label>
            <select
              {...register("organizationId", {
                required: {
                  value: true,
                  message: "Organización requerida",
                },
              })}
              className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
            >
              <option value="">Selecciona una organización</option>
              {organization.map(org => (
                <option key={org.id} value={org.id}>{org.fullName}</option>
              ))}
            </select>
            {errors.organizationId && <span className="text-red-500">{errors.organizationId.message}</span>}
    
            <button className="w-full bg-blue-500 text-white p-3 rounded-lg">
              Crear contacto
            </button>
          </form>
        </div>
      );
};

export default NewContactForm;
