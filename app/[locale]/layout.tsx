import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import type {Metadata} from 'next';
import '../globals.css';
import AuthProvider from '@/components/auth-provider';
import Header from '@/components/header';

export const metadata: Metadata = {
  title: 'AI Job Aggregator',
  description: 'Land your dream tech job with AI-tailored applications.',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body suppressHydrationWarning className="bg-[#0a0a0a] text-slate-200 pt-16">
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            <Header locale={locale} />
            {children}
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
