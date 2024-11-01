import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'PrivMatch',
  description: 'Explora perfiles exclusivos de acompañantes de lujo en España',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white antialiased">
        <div className="grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
