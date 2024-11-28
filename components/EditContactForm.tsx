import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import { Button } from "./ui/button";
import { useRouter, useParams } from "next/navigation";
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
  organizationId: number | string;
  country: string;
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
  } = useForm<FormValues>();

  const [open, setOpen] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`/api/contact/${params!.id}`);
        if (!response.ok) throw new Error('Failed to fetch contact');
        const contact = await response.json();
        
        // Reset form with contact data
        reset({
          name: contact.name,
          email: contact.email,
          organizationId: contact.organizationId,
          country: contact.country || ''
        });
      } catch (error) {
        console.error('Error fetching contact:', error);
      }
    };

    if (params?.id) {
      fetchContact();
    }
  }, [params?.id, reset]);

  const organizationOptions = organization.map((org) => ({
    value: org.id,
    label: org.fullName
  }));

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await onEditContact(data);
    setOpen(false);
  };

  return (
    <div className="flex-col h-auto flex justify-center items-center">
      <form className="flex flex-col gap-2 w-fit p-6 items-center justify-center" onSubmit={handleSubmit(onSubmit)}>
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
          Email:
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
          Country:
        </label>
        <input
          type="text"
          {...register("country")}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="Country"
        />

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
              /* @ts-ignore */
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

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant={"ce2"}>Edit Contact</Button>
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
                <Button variant={"ce2"}>Confirm Edit</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </div>
  );
};

export default EditContactForm;