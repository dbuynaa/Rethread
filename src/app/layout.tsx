import '@/styles/globals.css';

// import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';

import { Toaster } from '@/components/ui/toaster';
import { getServerAuthSession } from '@/server/auth';
import { Providers, RenderLayout } from '@/components/layout';
import { SpeedInsights } from '@vercel/speed-insights/next';

import relativeTime from 'dayjs/plugin/relativeTime'; // Import the plugin
import { extend } from 'dayjs';
extend(relativeTime);

export const metadata: Metadata = {
  title: 'ReThread',
  description: 'Created by Ben',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  return (
    <html
      lang="en"
      // className={`${GeistSans.variable}`}
      suppressHydrationWarning={true}
    >
      <body>
        <Providers session={session}>
          <NextTopLoader showSpinner={false} />
          <Toaster />
          <RenderLayout>{children}</RenderLayout>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
