import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

export const dynamic = 'force-dynamic';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: '言葉の栞',
  description: '心に刺さった一行を、誰かの道しるべに。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey="pk_test_Y2VudHJhbC1wbGF0eXB1cy00OS5jbGVyay5hY2NvdW50cy5kZXYk"
      appearance={{
        variables: { colorPrimary: '#000000' },
        elements: {
          formButtonPrimary: 'bg-gradient-to-r from-[#FFFC00] to-[#FFA500] text-black hover:opacity-90 border-none',
          footerActionLink: 'text-black hover:text-gray-600',
        }
      }}
    >
      <html lang="ja">
        <body className={`${notoSansJP.className} antialiased bg-white text-black min-h-screen pb-20`}>
          <Header />
          <main className="container mx-auto px-4 py-6 max-w-2xl">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
