import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import "@/shared/styles/globals.css";
import { MainProvider } from "@/shared/providers";
import { CookieConsent, Footer, Sidebar } from "@/shared/components/ui";
import { MobileHeader } from "@/shared/components/layout/MobileHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Диванный эксперт",
  description: "Форум ММА для голосования с ретйингом пользователей",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MainProvider>
            <div className="relative flex min-h-screen">
              <div className="hidden md:block">
                <Sidebar />
              </div>

              {/* Основной контейнер контента */}
              <div className="flex-1 pl-0 md:pl-64 flex flex-col">
                <MobileHeader />
                <main className="container mx-auto p-6 flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
            <CookieConsent />
          </MainProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
