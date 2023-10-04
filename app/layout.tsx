import './globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import { clarity } from 'react-microsoft-clarity';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ElectionGPT',
  description: 'Explore the upcoming candidates for US president in the 2024 election and their proposals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  clarity.init("j527gtblbh");
  return (
    <html lang="en">
      <body className={'chat-container ' + inter.className}>
        {children}
        <Analytics /> 
      </body>
    </html>
  );
}
