import type { Metadata } from 'next';
// import { Poppins } from 'next/font/google';
import { Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import './globals.css';
import Providers from './Providers';

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
    <html lang='en'>
      <body
        className={`${outfit.className} antialiased h-screen overflow-hidden max-w-6xl mx-auto`}
      >
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
