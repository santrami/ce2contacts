import { useEffect, useRef } from "react";
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
  const dialogAlert = useRef(null);
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
    }, // <-- Forma de inicializar los valores del formulario con los valores por default
  });

  useEffect(() => {
    const profile = async () => {
      const response = await fetch(`/api/user/${params!.id}`);
      const data = await response.json();
      const { password, ...user } = data;
      reset(user);
    };
    profile();
  }, [reset]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Modificar usuario
    const editProfile = {
      username: data.username,
      email: data.email,
      password: data.password,
    };
    const dialog = document.getElementById("radix-:r0:");

    // Remove the dialog element if it exists
    if (dialog) {
      // Get the previous sibling of the dialog element
      const previousSibling = dialog.previousElementSibling;

      // Remove the previous sibling if it exists
      if (previousSibling) {
        previousSibling.remove();
      }

      // Finally, remove the dialog element
      dialog.remove();
    }

    const body= document.getElementsByTagName("body")
    body[0].style.removeProperty("pointer-events")
    // Llamar a la función de callback para pasar el nuevo contacto al componente padre
    onEditProfile(editProfile);
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

        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          new Password:
        </label>
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "password required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="new Password"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}

        <label
          htmlFor="confirm_password"
          className="text-slate-500 mb-2 block text-sm"
        >
          confirm Password:
        </label>
        <input
          type="password"
          {...register("confirm_password", {
            required: true,

            validate: (val: string) => {
              if (watch("password") != val) {
                return "Your passwords do no match";
              }
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="new Password"
        />
        {errors.confirm_password && (
          <span className="text-red-500">
            {errors.confirm_password.message}
          </span>
        )}

        {/**********************  alert dialog ************************/}

        <AlertDialog>
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
        <button className="w-full bg-blue-500 text-white p-3 rounded-lg">
          Edit Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
