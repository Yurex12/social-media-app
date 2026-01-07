import type { Metadata } from 'next';
// import { Poppins } from 'next/font/google';
import { Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import './globals.css';

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
      <body className={`${outfit.className} antialiased max-w-7xl mx-auto`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
