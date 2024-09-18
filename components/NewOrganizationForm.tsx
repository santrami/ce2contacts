import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
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
  acronym: string | null;
  fullName: string;
  regionalName: string | null;
  website: string | null;
  country: string | null;
}

interface NewOrganizationFormProps {
  onCreateOrganization: (newOrganization: FormValues) => Promise<void>;
}

interface Country{
  value: string;
  label: string;
}

const NewContactForm: React.FC<NewOrganizationFormProps> = ({ onCreateOrganization }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<FormValues>();
  
  const [countries, setCountries] = useState<Country[]>([]);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Crear el nuevo contacto
    const newOrganization: FormValues = {
      acronym: data.acronym,
      fullName: data.fullName,
      regionalName: data.regionalName,
      website: data.website,
      country: data.country,
    };

    // Llamar a la función de callback para pasar el nuevo contacto al componente padre
    onCreateOrganization(newOrganization);

    reset();


    setOpen(false);

    // Limpiar el formulario después de crear la organización
  };

  const fetchCountries = async () => {
    const response = await fetch("https://valid.layercode.workers.dev/list/countries?format=select&flags=true");
    const data = await response.json();

      setCountries(data.countries);
      
    };

  useEffect(() => {
    
      fetchCountries();
  }, []);

  return (
    <div className="flex flex-col h-auto justify-center items-center gap-3">
      <form
        className="flex flex-col w-fit max-w-lg p-6 gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* acronym */}
        <label htmlFor="acronym" className="text-slate-500 mb-2 block text-sm">
          Acronym:
        </label>
        <input
          type="text"
          {...register("acronym")}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="Acronym"
        />
        {errors.acronym && (
          <span className="text-red-500">{errors.acronym.message}</span>
        )}

        {/* fullName */}

        <label htmlFor="fullName" className="text-slate-500 mb-2 block text-sm">Full Name</label>
        <input
          type="text"
          {...register("fullName", {
            required: {
              value: true,
              message: "Name required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="Full Name"
        />
        {errors.fullName && (
          <span className="text-red-500">{errors.fullName.message}</span>
        )}

        {/* regionalName */}

        <label htmlFor="regionalName" className="text-slate-500 mb-2 block text-sm">Regional Name</label>
        <input
          type="text"
          {...register("regionalName")}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="Regional Name"
        />
        {errors.regionalName && (
          <span className="text-red-500">{errors.regionalName.message}</span>
        )}

        {/* website */}

        <label htmlFor="website" className="text-slate-500 mb-2 block text-sm">Website</label>
        <input
          type="text"
          {...register("website")}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="Website"
        />
        {errors.website && (
          <span className="text-red-500">{errors.website.message}</span>
        )}

        <label htmlFor="country" className="text-slate-500 mb-2 block text-sm">Country</label>
        <Controller
          name="country"
          control={control}
          rules={{ required: "Country required" }}
          render={({ field: {value, onChange, ref} }) => (
            <Select
              ref={ref}
              options={countries}
              className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
              placeholder="Country"
              // @ts-ignore
              onChange={(selectedOption) => onChange(selectedOption?.label)} // Store the label in form state
              value={countries.find((c) => c.label === value) ?? ""}
              
            />
          )}
        />
        {errors.country && (
          <span className="text-red-500">{errors.country.message}</span>
        )}

        {/**********************  Alert Dialog ************************/}

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant={"ce2"}>Create Organization</Button>
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
                <Button variant={"ce2"}>Create Organization</Button>
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
