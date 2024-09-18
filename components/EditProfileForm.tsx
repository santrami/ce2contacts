import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams } from "next/navigation";

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
import { Button } from "./ui/button";

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

const EditProfileForm = ({ onEditProfile }) => {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    const profile = async () => {
      const response = await fetch(`/api/user/${params!.id}`);
      const data = await response.json();
      const { password, ...user } = data;
      reset(user);
    };
    profile();
  }, [reset, params!.id]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const editProfile = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    // Call the parent component's edit function
    onEditProfile(editProfile);

    setOpen(false);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <form className="flex flex-col min-w-72 max-w-lg p-6 gap-1">
        <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
          Edit username:
        </label>
        <input
          type="text"
          {...register("username", {
            required: {
              value: true,
              message: "Name required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="Name"
        />
        {errors.username && (
          <span className="text-red-500">{errors.username.message}</span>
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
          placeholder="Email"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          New Password:
        </label>
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "Password required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="New Password"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}

        <label
          htmlFor="confirm_password"
          className="text-slate-500 mb-2 block text-sm"
        >
          Confirm Password:
        </label>
        <input
          type="password"
          {...register("confirm_password", {
            required: true,
            validate: (val: string) => {
              if (watch("password") !== val) {
                return "Passwords do not match";
              }
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="Confirm Password"
        />
        {errors.confirm_password && (
          <span className="text-red-500">
            {errors.confirm_password.message}
          </span>
        )}

        {/**********************  Alert Dialog ************************/}

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant={"ce2"}>Edit Profile</Button>
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

export default EditProfileForm;
