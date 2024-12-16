"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
  acronym: string | null;
  fullName: string;
  regionalName: string | null;
  website: string | null;
  country: string | null;
}

interface NewOrganizationFormProps {
  onCreateOrganization: (newOrganization: FormValues) => Promise<void>;
}

const NewOrganizationForm: React.FC<NewOrganizationFormProps> = ({ onCreateOrganization }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>();
  
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await onCreateOrganization(data);
    reset();
    setOpen(false);
  };

  return (
    <div className="form-container">
      <h2 className="form-header">Create New Organisation</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="form-group">
        <div>
          <label className="form-label">Acronym:</label>
          <Input
            type="text"
            {...register("acronym")}
            placeholder="Acronym"
            className="form-input"
          />
          {errors.acronym && (
            <span className="text-red-500 text-sm">{errors.acronym.message}</span>
          )}
        </div>

        <div>
          <label className="form-label">Full Name:</label>
          <Input
            type="text"
            {...register("fullName", {
              required: "Full name is required",
            })}
            placeholder="Full Name"
            className="form-input"
          />
          {errors.fullName && (
            <span className="text-red-500 text-sm">{errors.fullName.message}</span>
          )}
        </div>

        <div>
          <label className="form-label">Regional Name:</label>
          <Input
            type="text"
            {...register("regionalName")}
            placeholder="Regional Name"
            className="form-input"
          />
          {errors.regionalName && (
            <span className="text-red-500 text-sm">{errors.regionalName.message}</span>
          )}
        </div>

        <div>
          <label className="form-label">Website:</label>
          <Input
            type="url"
            {...register("website")}
            placeholder="https://example.com"
            className="form-input"
          />
          {errors.website && (
            <span className="text-red-500 text-sm">{errors.website.message}</span>
          )}
        </div>

        <div>
          <label className="form-label">Country:</label>
          <Input
            type="text"
            {...register("country")}
            placeholder="Country"
            className="form-input"
          />
          {errors.country && (
            <span className="text-red-500 text-sm">{errors.country.message}</span>
          )}
        </div>

        <div className="form-buttons">
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="default">Create Organization</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will create a new organisation in the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit(onSubmit)}>
                  Create Organization
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Link href="/">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default NewOrganizationForm;