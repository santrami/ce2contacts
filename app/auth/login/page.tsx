"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type FormValues = {
  email: string;
  password: string;
};

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router= useRouter()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const res= await signIn('credentials', {
      email: data.email,
      password: data.password, 
      redirect:false
    });
    console.log(res);
    

    if (res?.error){
      toast.error(res.error)
    }else{
      router.push('/')
    }
  }

  return (
    <div className="bg-slate-800 h-[calc(100vh)] flex justify-center items-center">
      <ToastContainer/>
      <form className="w-1/4" onSubmit={handleSubmit(onSubmit)}>
        <h1>login</h1>
        <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
          email:
        </label>
        <input
          type="text"
          {...register("email", {
            required: {
              value: true,
              message: "email required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="user"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          password:
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

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

// "use client";
// import { useForm } from "react-hook-form";
// import { signIn } from "next-auth/react";
// import {useRouter} from 'next/navigation'
// import {useState} from 'react'

// function LoginPage() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();
//   const router = useRouter()
//   const [error, setError] = useState(null)

//   const onSubmit = handleSubmit(async (data) => {
//     console.log(data);

//     const res = await signIn("credentials", {
//       email: data.email,
//       password: data.password,
//       redirect: false,
//     });

//     console.log(res)
//     //@ts-ignore
//     if (res.error) {
//       //@ts-ignore
//       setError(res.error)
//     } else {
//       router.push('/dashboard')
//       router.refresh()
//     }
//   });

//   return (
//     <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
//       <form onSubmit={onSubmit} className="w-1/4">

//         {error && (
//           <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">{error}</p>
//         )}

//         <h1 className="text-slate-200 font-bold text-4xl mb-4">Login</h1>

//         <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
//           Email:
//         </label>
//         <input
//           type="email"
//           {...register("email", {
//             required: {
//               value: true,
//               message: "Email is required",
//             },
//           })}
//           className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
//           placeholder="user@email.com"
//         />

//         {errors.email && (
//           <span className="text-red-500 text-xs">{errors.email.message}</span>
//         )}

//         <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
//           Password:
//         </label>
//         <input
//           type="password"
//           {...register("password", {
//             required: {
//               value: true,
//               message: "Password is required",
//             },
//           })}
//           className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
//           placeholder="******"
//         />

//         {errors.password && (
//           <span className="text-red-500 text-xs">
//             {errors.password.message}
//           </span>
//         )}

//         <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }
// export default LoginPage;
