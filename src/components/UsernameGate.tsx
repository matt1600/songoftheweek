'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function UsernameGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      router.replace(`/create-username?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [router, pathname]);

  return <>{children}</>;
}
