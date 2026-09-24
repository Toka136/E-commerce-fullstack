'use client'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader } from 'lucide-react';
import { useVerifyEmail } from '../hooks/useVerifyEmail';

export const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { isLoading, isSuccess, isError, data, errorMessage } = useVerifyEmail(token);

  return (
    <div className="mt-10 flex flex-col items-center justify-center  text-center space-y-4 pt-24">
      {!token && (
        <>
          <XCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">Invalid verification link</h2>
          <p className="text-sm text-gray-500">The verification token is missing from the link.</p>
        </>
      )}

      {token && isLoading && (
        <>
          <Loader className="h-12 w-12 text-[#3b59c4] animate-spin" />
          <h2 className="text-lg font-semibold text-gray-900">Verifying your email...</h2>
          <p className="text-sm text-gray-500">This will only take a moment.</p>
        </>
      )}

      {isSuccess && (
        <div className="flex w-[50%] flex-col items-center gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm">
          <CheckCircle2 className="h-12 w-12 text-[#3b59c4]" />
          <h2 className="text-lg font-semibold text-gray-900">Email verified!</h2>
          <p className="text-sm text-gray-500">
            {data?.message ?? "Your account is ready. You can now log in."}
          </p>
          <Link
            href="/login"
            className="w-fit flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-white bg-[#3b59c4] hover:bg-[#2f49aa] transition-colors duration-200"
          >
            Go to Login
          </Link>
        </div>
      )}

      {isError && (
        <>
          <XCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">Verification failed</h2>
          <p className="text-sm text-gray-500">{errorMessage}</p>
          <Link
            href="/register"
            className="text-sm font-semibold text-[#3b59c4] hover:underline"
          >
            Back to register
          </Link>
        </>
      )}
    </div>
  );
};