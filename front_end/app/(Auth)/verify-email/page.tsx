import { VerifyEmail } from '@/features/Auth/components/VerifyEmail';
import { LoaderC } from '@/UI/components/Loader';
import { CircularProgress } from '@mui/material';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoaderC/>}>
      <VerifyEmail />
    </Suspense>
  );
}