// @/admin/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Admin() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    const redirect = async () => {
      try {
        if (status === 'authenticated') {
          await router.replace('/admin/dashboard');
        } else {
          await router.replace('/admin/login');
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };

    redirect();
  }, [status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>Loading...</div>
    </div>
  );
}