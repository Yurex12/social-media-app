import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LightBox } from '@/components/LightBox';
import { Toaster } from '@/components/ui/sonner';
import { NotificationListener } from '@/features/notification/components/NotificationListener';
import './globals.css';
import Providers from './Providers';

import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: 'Vox',
    absolute: 'Vox',
  },
  description: 'Your voice, amplified.',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased h-dvh overflow-y-scroll overflow-x-hidden`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <LightBox />
            <ConfirmDialog />
            <NotificationListener />
            {children}
          </Providers>
        </ThemeProvider>
        <Toaster position='top-center' />
      </body>
    </html>
  );
}
