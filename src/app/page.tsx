'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem('userName');
    if (username) {
      router.replace('/groups');
    } else {
      router.replace('/create-username');
    }
  }, [router]);

  return <div>Loading...</div>;
}
