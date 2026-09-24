'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, Unlock, Loader, XCircle, CheckCircle2 } from 'lucide-react';
import { useFormik } from 'formik';
import { useResetPassword } from '../hooks/useResetPassword';
import { resetPasswordSchema } from '../schema/passwordSchema';

export const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const token = useSearchParams().get('token');
  const { handleResetPassword, isPending, isSuccess } = useResetPassword();

  const formik = useFormik({
    initialValues: { password: '' },
    validationSchema: resetPasswordSchema,
    onSubmit: ({ password }) => {
      if (token) handleResetPassword({ token, password });
    },
  });

  if (!token) {
    return (
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-semibold text-gray-900">Invalid reset link</h1>
        <p className="text-sm text-gray-400">The reset token is missing from the link.</p>
        <Link href="/forgot-password" className="text-sm font-semibold text-[#3b59c4] hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900">Reset Password</h1>
      <p className="text-sm text-gray-400 mt-1">Choose a new password for your account</p>

      <form className="space-y-5 mt-8" onSubmit={formik.handleSubmit}>
        {isSuccess && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-[#3b59c4]/30 bg-[#3b59c4]/10 p-4"
          >
            <CheckCircle2 className="h-5 w-5 text-[#3b59c4] mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium text-[#3b59c4]">
              Your password has been reset. Redirecting you to login...
            </p>
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative rounded-md shadow-sm">
            <div
              className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer z-10"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Unlock className="h-5 w-5 text-gray-300" aria-hidden="true" />
              ) : (
                <Lock className="h-5 w-5 text-gray-300" aria-hidden="true" />
              )}
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-300 bg-gray-50/30 text-sm"
              placeholder="••••••••"
            />
          </div>
          {formik.errors.password && formik.touched.password && (
            <span className="text-red-500 text-xs mt-1 block">{formik.errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || isSuccess}
          className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#3b59c4] hover:bg-[#2f49aa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader className="h-5 w-5 animate-spin" /> : "Reset Password"}
        </button>
      </form>
    </>
  );
};