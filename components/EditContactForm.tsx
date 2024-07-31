import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface FormValues {
  name: string;
  email: string;
  organizationId: number | string;
}

type EditContactFormProps = {
  organization: {
    id: number;
    acronym: string;
    fullName: string;
    regionalName: string | null;
    website: string;
    country: string | null;
  }[];
  onEditContact: (editContact: FormValues) => Promise<void>;
};

const EditContactForm: React.FC<EditContactFormProps> = ({
  organization,
  onEditContact,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      organizationId: "",
    },
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const params = useParams();

  const router = useRouter();

  useEffect(() => {
    const contact = async () => {
      const response = await fetch(`/api/contact/${params!.id}`);
      const data = await response.json();
      const {password, ...contact } = data;
      reset(contact)
    };
    contact();
  }, [reset]);

  const organizationOptions = organization.map((org) => ({
    value: org.id,
    label: org.fullName
  }));

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Validar los datos del formulario

    // Crear el nuevo contacto
    const editContact: FormValues = {
      name: data.name,
      email: data.email,
      organizationId: Number(data.organizationId),
    };

    // Llamar a la función de callback para pasar el nuevo contacto al componente padre
    onEditContact(editContact);

    // Limpiar el formulario después de crear el contacto
    setName("");
    setEmail("");
  };
  

  return (
    <div className="flex-col bg-slate-800 h-[calc(100vh)] flex justify-center items-center">
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
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}

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
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <label
          htmlFor="organizationId"
          className="text-slate-500 mb-2 block text-sm"
        >
          Organization:
        </label>
        <Controller
          name="organizationId"
          control={control}
          rules={{ required: "Organization required" }}
          render={({ field: { value, onBlur, onChange, ref } }) => (
            <Select
              ref={ref}
              options={organizationOptions}
              value={organizationOptions.find((c) => c.value === value) ?? ""}
              // @ts-ignore
              onChange={(e) => onChange(e.value)}
              onBlur={onBlur}
              className="text-slate-900 focus:bg-slate-300 focus:text-slate-900"
              placeholder="Select an organization"
              classNamePrefix="react-select"
            />
          )}
        />
        {errors.organizationId && (
          <span className="text-red-500">{errors.organizationId.message}</span>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-4">
          Edit Contact
        </button>
      </form>
      <Button onClick={() => router.push("/")} variant={"secondary"}>
        back
      </Button>
    </div>
  );
};

export default EditContactForm;