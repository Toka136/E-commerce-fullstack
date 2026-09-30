import { ForgotPasswordForm } from '@/features/Auth/components/ForgotPasswordForm';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
    

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <ForgotPasswordForm />
      </div>

      <p className="text-sm text-gray-500 mt-8">
        Remember your password?{' '}
        <Link href="/login" className="font-medium text-blue-500 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}