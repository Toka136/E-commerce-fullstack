'use client'

import Link from 'next/link';
import { Mail, Loader } from 'lucide-react';
import { useFormik } from 'formik';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { forgotPasswordSchema } from '../schema/passwordSchema';
import { forgotPasswordInputT } from '../types/passwordType';

export const ForgotPasswordForm = () => {
  const { handleForgotPassword, isPending, isSuccess } = useForgotPassword();

  const formik = useFormik<forgotPasswordInputT>({
    initialValues: { email: '' },
    validationSchema: forgotPasswordSchema,
    onSubmit: (values) => handleForgotPassword(values),
  });

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900">Forgot Password?</h1>
      <p className="text-sm text-gray-400 mt-1">
        Enter your email and we'll send you a link to reset it
      </p>

      <form className="space-y-5 mt-8" onSubmit={formik.handleSubmit}>
        {isSuccess && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-[#3b59c4]/30 bg-[#3b59c4]/10 p-4"
          >
            <Mail className="h-5 w-5 text-[#3b59c4] mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium text-[#3b59c4]">
              If an account exists for that email, we've sent a password reset link. Please check your inbox.
            </p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-300" aria-hidden="true" />
            </div>
            <input
              type="email"
              name="email"
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-300 bg-gray-50/30 text-sm"
              placeholder="reader@libro.com"
            />
          </div>
          {formik.errors.email && formik.touched.email && (
            <span className="text-red-500 text-xs mt-1 block">{formik.errors.email}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#3b59c4] hover:bg-[#2f49aa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader className="h-5 w-5 animate-spin" /> : "Send Reset Link"}
        </button>
      </form>
    </>
  );
};