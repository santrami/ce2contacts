import { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
  organizationId: { value: string; label: string };
  sectorId: { value: string; label: string };
  projectParticipation: boolean;
  country: string;
  termsId?: number;
}

interface Terms {
  id: number;
  description: string;
}

interface NewContactFormProps {
  organization: {
    id: number;
    acronym: string;
    fullName: string;
    regionalName: string | null;
    website: string;
    country: string | null;
  }[];
  sectors: {
    id: number;
    name: string;
  }[];
  onCreateContact: (newContact: any) => Promise<void>;
}

const NewContactForm: React.FC<NewContactFormProps> = ({
  organization,
  sectors,
  onCreateContact,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();
  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState<Terms[]>([]);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch('/api/terms');
        if (!response.ok) throw new Error('Failed to fetch terms');
        const data = await response.json();
        setTerms(data);
      } catch (error) {
        console.error('Error fetching terms:', error);
      }
    };

    fetchTerms();
  }, []);

  const organizationOptions = organization.map((org) => ({
    value: org.id.toString(),
    label: org.fullName
  }));

  const sectorOptions = sectors.map((sector) => ({
    value: sector.id.toString(),
    label: sector.name
  }));

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await onCreateContact(data);
    setOpen(false);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form-group">
        <div>
          <label className="form-label">Complete Name:</label>
          <Input
            type="text"
            {...register("name", {
              required: "Name is required",
            })}
            placeholder="Name"
            className="form-input"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div>
          <label className="form-label">Email:</label>
          <Input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            placeholder="Email"
            className="form-input"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="form-label">Country:</label>
          <Input
            type="text"
            {...register("country", {
              required: "Country is required",
            })}
            placeholder="Country"
            className="form-input"
          />
          {errors.country && (
            <span className="text-red-500 text-sm">{errors.country.message}</span>
          )}
        </div>

        <div>
          <label className="form-label">Organisation:</label>
          <Controller
            name="organizationId"
            control={control}
            rules={{ required: "Organization is required" }}
            render={({ field }) => (
              <Select 
                {...field}
                options={organizationOptions}
                className="react-select text-slate-950"
                classNamePrefix="react-select"
                placeholder="Select organization"
              />
            )}
          />
          {errors.organizationId && (
            <span className="text-red-500 text-sm">{errors.organizationId.message}</span>
          )}
        </div>

        <div>
          <label className="form-label">Sector:</label>
          <Controller
            name="sectorId"
            control={control}
            rules={{ required: "Sector is required" }}
            render={({ field }) => (
              <Select 
                {...field}
                options={sectorOptions}
                className="react-select text-black"
                classNamePrefix="react-select"
                placeholder="Select sector"
              />
            )}
          />
          {errors.sectorId && (
            <span className="text-red-500 text-sm">{errors.sectorId.message}</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            {...register("projectParticipation")}
            className="h-4 w-4"
          />
          <label className="text-sm font-medium text-gray-200">
            Project Participant
          </label>
        </div>

        {terms.map((term) => (
          <div key={term.id} className="flex items-start gap-2 mt-4">
            <input
              type="checkbox"
              {...register("termsId", {
                required: "Terms acceptance is required"
              })}
              value={term.id}
              className="h-4 w-4 mt-1"
            />
            <label className="text-sm text-gray-200">
              {term.description}
            </label>
          </div>
        ))}
        {errors.termsId && (
          <span className="text-red-500 text-sm block mt-1">{errors.termsId.message}</span>
        )}

        <div className="form-buttons">
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="default">Create Contact</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will create a new contact in the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit(onSubmit)}>
                  Create Contact
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Link href="/">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>

      <p className="text-sm text-gray-400 mt-4">
        *if organization is not listed, you can create one first{" "}
        <Link href="/newOrganization" className="text-blue-400 hover:underline">
          here
        </Link>
      </p>
    </div>
  );
};

export default NewContactForm;