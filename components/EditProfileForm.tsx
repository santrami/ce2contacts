import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams } from "next/navigation";

interface FormValues {
  username: string;
  email: string;
  password:string;
}

const EditProfileForm = ({ onEditProfile }) => {
  const params = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      password:""
    } // <-- Forma de inicializar los valores del formulario con los valores por default
  });

  useEffect(() => {
    const profile = async () => {
      const response = await fetch(`/api/user/${params!.id}`);
      const data = await response.json();
      const {password, ...user } = data;
      reset(user)
    };
    profile();
  }, [reset]);


  

  const [username, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Modificar usuario
    const editProfile: FormValues = {
      username: data.username,
      email: data.email,
      password: data.password
    };

    // Llamar a la función de callback para pasar el nuevo contacto al componente padre
    onEditProfile(editProfile);
  };

  return (
    <div className="flex flex-col bg-zinc-900 justify-center items-center gap-10">
      <form
        className="flex flex-col w-fit max-w-lg p-6 gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          type="text"
          {...register("password", {
            required: {
              value: true,
              message: "password required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="new Password"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg">
          Edit Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
