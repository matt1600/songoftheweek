'use client';
import { Suspense } from 'react';
import UsernameForm from '@/components/UsernameForm';

export default function CreateUsernamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsernameForm />
    </Suspense>
  );
}