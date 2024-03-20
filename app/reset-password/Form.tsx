'use client'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

type ForgotPasswordInputs = {
  email: string;
}

const ForgotPasswordForm = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInputs>()

  const onSubmit = async (data: ForgotPasswordInputs) => {
    console.log(data);
      
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responsedata= await response.json()
      
      if (!response.ok) {
        throw new Error('There was an error sending the reset password email.');
      }

      // Show success message and possibly redirect
      toast.success('If the email is associated with an account, a password reset email will be sent.');
      // Optionally, redirect to the login page or a page that says 'Check your email'
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset password email.');
    }
  }

  return (
    <div className="flex flex-col bg-slate-800 h-screen justify-center items-center">
        <ToastContainer />
      <div className="flex-col">
        <h1 className="">Forgot Password</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            placeholder="email"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
          <button className="w-full bg-blue-500 text-white p-3 rounded-lg">
            Reset my password
          </button>
        </form>
        <div>
          Remembered your password?{' '}
          <Link className="text-green-400 text-sm mt-4" href="/signin">
            <button className="link">Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordForm