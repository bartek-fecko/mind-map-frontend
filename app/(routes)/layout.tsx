import type { Metadata } from 'next';
import '../globals.css';
import { Inter } from 'next/font/google';
import { Geist_Mono } from 'next/font/google';
import SessionProvider from '../providers/SessionProvider';
import AlertContainer from '../components/Alert/AlertContainer';
import ModalManager from '../modals/ModalManager';
import SessionChecker from '../providers/SessionChecker';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Mind Map - Visualize Your Thoughts',
  description: 'Create anything you imagine',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}>
        <SessionProvider>
          <SessionChecker />
          <main className="flex flex-grow overflow-auto">{children}</main>
          <AlertContainer />
          <ModalManager />
        </SessionProvider>
      </body>
    </html>
  );
}
