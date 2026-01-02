import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: '500',
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
        className={`${poppins.variable} antialiased max-w-400 mx-auto px-4 md:px-0`}
      >
        {children}
      </body>
    </html>
  );
}
