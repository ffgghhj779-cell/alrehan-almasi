import type { Metadata, Viewport } from 'next';
import { Cairo, Tajawal } from 'next/font/google';
import './globals.css';

import Providers from '@/components/Providers';
import PageTransition from '@/components/PageTransition';
import WhatsAppButton from '@/components/WhatsAppButton';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'الرهان الماسي | شريكك الموثوق لتوريد المنتجات الغذائية',
  description:
    'الرهان الماسي شركة متخصصة في توريد المنتجات الغذائية الطازجة والمجمدة داخل المملكة العربية السعودية.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body
        className="font-tajawal bg-primary text-text-dark antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        <Providers>
          <PageTransition>{children}</PageTransition>
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
