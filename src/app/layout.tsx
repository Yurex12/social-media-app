import type { Metadata } from 'next';
// import { Poppins } from 'next/font/google';
import { Outfit } from 'next/font/google';

import './globals.css';
import Providers from './Providers';
import { GlobalLightBox } from '@/components/GlobalLightbox';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { NotificationListener } from '@/features/notification/components/NotificationListener';
import { Toaster } from '@/components/ui/sonner';

import { ThemeProvider } from '@/components/theme-provider';

// const poppins = Poppins({
//   subsets: ['latin'],
//   variable: '--font-poppins',
//   weight: '500',
// });

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | yusufblog',
    default: 'yusufblog',
  },
  description: 'Say your mind',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${outfit.className} antialiased h-screen overflow-y-scroll overflow-x-hidden`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <GlobalLightBox />
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
