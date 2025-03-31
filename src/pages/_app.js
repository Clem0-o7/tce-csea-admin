import { SessionProvider } from 'next-auth/react';
import  Providers from './_providers';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { useEffect } from 'react';
import { LoadingProvider, useLoading } from '@/contexts/LoadingContext';
import GlobalLoading from '@/components/GlobalLoading';

//Test Changes

const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const shouldApplyBackground = router.pathname !== '/' && !router.pathname.startsWith('/admin');

  return (
    <SessionProvider session={session}>
      <LoadingProvider>
        <LoadingHandler />
        <GlobalLoading />
        <Providers>
          <div className="relative w-full min-h-screen">
            {shouldApplyBackground && (
              <div className="absolute inset-0 -z-10">
                <AuroraBackground />
              </div>
            )}
            <Component {...pageProps} />
          </div>
        </Providers>
      </LoadingProvider>
    </SessionProvider>
  );
}

// Handles route change events for the global loading screen
function LoadingHandler() {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleStop = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router, setIsLoading]);

  return null;
}

export default MyApp;
