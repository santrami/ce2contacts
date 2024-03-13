"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import {useRouter} from 'next/navigation'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router=useRouter()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.password !== data.confirmPassword) {
      return toast.error("passwords do not match!");
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(res.ok){
      router.push('/auth/login')
    }

    console.log(errors)
  };
  return (
    <div className="bg-slate-800 h-[calc(100vh)] flex justify-center items-center">
      <ToastContainer/>
      <form className="w-1/4" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
          Username:
        </label>
        <input
          type="text"
          {...register("username", {
            required: {
              value: true,
              message: "username required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="user"
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
              message: "email required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="email"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          Password:
        </label>

        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "password required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="******"
          autoComplete="off"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}

        <label
          htmlFor="confirmPassword"
          className="text-slate-500 mb-2 block text-sm"
        >
          Confirm Password:
        </label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: {
              value: true,
              message: "confirm password required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="******"
          autoComplete="off"
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
