import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FormValues {
  name: string;
  email: string;
  country:string;
  organizationId: number | string;
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

const NewContactForm: React.FC<NewContactFormProps> = ({
  organization,
  onCreateContact,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = (data) => {    

    // Crear el nuevo contacto
    const newContact: FormValues = {
      name: data.name,
      email: data.email,
      country: data.country,
      organizationId: Number(data.organizationId),
    };

    // Llamar a la función de callback para pasar el nuevo contacto al componente padre
    onCreateContact(newContact);

    setOpen(false);

    // Limpiar el formulario después de crear el contacto
    setName("");
    setEmail("");
  };

  const organizationOptions = organization.map((org) => ({
    value: org.id,
    label: org.fullName
  }));
  

  return (
    <div className="flex flex-col h-auto justify-center items-center gap-10">
      <form
        className="flex flex-col w-fit max-w-lg p-6 gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
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
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="email"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

<label htmlFor="country" className="text-slate-500 mb-2 block text-sm">
          country:
        </label>
        <input
          type="text"
          {...register("country", {
            required: {
              value: true,
              message: "country required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="country"
        />
        {errors.country && (
          <span className="text-red-500">{errors.country.message}</span>
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
          render={({ field: {value, onBlur, onChange, ref} }) => (
            <Select
              ref={ref}
              options={organizationOptions}
              value={organizationOptions.find((c) => c.value === value) ?? ""}
              // @ts-ignore
              onChange={(e) => onChange(e?.value)}
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
        <p className="text-sm">*if organization is not listed, you can create one before <span className="text-blue-600"><Link href="/newOrganization">here</Link></span> </p>
        {/**********************  Alert Dialog ************************/}

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant={"ce2"}>Create Contact</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently update your
                account and remove your old data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit(onSubmit)} asChild>
                <Button variant={"ce2"}>Create Contact</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
      <Button onClick={() => router.push("/")} variant={"secondary"}>
        back
      </Button>
    </div>
  );
};

export default NewContactForm;
