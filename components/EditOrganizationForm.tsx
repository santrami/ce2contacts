import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormValues {
  acronym: string;
  fullName: string;
  regionalName: string;
  website: string;
  country: string;
}

const EditOrganizationForm = ({ onEditOrganization, organization }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    defaultValues: {
      acronym: "",
      fullName: "",
      regionalName: "",
      website: "",
      country: "",
    },
  });
  useEffect(() => {
    let defaults= {
      acronym: organization?.acronym,
      fullName: organization?.fullName,
      regionalName: organization?.regionalName,
      website: organization?.website,
      country: organization?.country,
    };
    reset(defaults);
  }, [reset,organization])
  
  const [acronym, setAcronym] = useState("");
  const [fullName, setFullName] = useState("");
  const [regionalName, setRegionalName] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const editOrganization: FormValues = {
      acronym: data.acronym,
      fullName: data.fullName,
      regionalName: data.regionalName,
      website: data.website,
      country: data.country,
    };

    // Llamar a la función de callback para pasar el nuevo contacto al componente padre
    onEditOrganization(editOrganization);

    // Limpiar el formulario después de crear el contacto
    setAcronym("");
    setFullName("");
    setRegionalName("");
    setWebsite("");
    setCountry("");
  };

  return (
    <div className="flex flex-col bg-zinc-900 justify-center items-center gap-10">
      <form
        className="flex flex-col w-fit max-w-lg p-6 gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="acronym" className="text-slate-500 mb-2 block text-sm">
          Edit acronym:
        </label>
        <input
          type="text"
          {...register("acronym", {
            required: {
              value: false,
              message: "Acronym required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="Name"
        />
        {errors.acronym && (
          <span className="text-red-500">{errors.acronym.message}</span>
        )}

        <label htmlFor="fullName" className="text-slate-500 mb-2 block text-sm">
          Edit fullName:
        </label>
        <input
          type="text"
          {...register("fullName", {
            required: {
              value: false,
              message: "fullName required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="Name"
        />
        {errors.fullName && (
          <span className="text-red-500">{errors.fullName.message}</span>
        )}

        <label
          htmlFor="regionalName"
          className="text-slate-500 mb-2 block text-sm"
        >
          Edit regionalName:
        </label>
        <input
          type="text"
          {...register("regionalName", {
            required: {
              value: false,
              message: "regionalName required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="Name"
        />
        {errors.regionalName && (
          <span className="text-red-500">{errors.regionalName.message}</span>
        )}

        <label htmlFor="website" className="text-slate-500 mb-2 block text-sm">
          Edit website:
        </label>
        <input
          type="text"
          {...register("website", {
            required: {
              value: false,
              message: "website required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="Name"
        />
        {errors.website && (
          <span className="text-red-500">{errors.website.message}</span>
        )}

        <label htmlFor="country" className="text-slate-500 mb-2 block text-sm">
          Edit country:
        </label>
        <input
          type="text"
          {...register("country", {
            required: {
              value: false,
              message: "country required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-300 text-slate-900 w-full"
          placeholder="Name"
        />
        {errors.country && (
          <span className="text-red-500">{errors.country.message}</span>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg">
          Edit Organization
        </button>
      </form>
    </div>
  );
};

export default EditOrganizationForm;
