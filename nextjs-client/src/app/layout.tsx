import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../shared/styles/globals.css";
import { MainProvider } from "../shared/providers";
import { AuthButtons, CookieConsent, Footer, Sidebar, ToggleTheme } from "../shared/components/ui";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MainProvider>
          <div className="relative flex min-h-screen">
          <Sidebar />

          {/* Основной контейнер контента */}
          <div className="flex-1 pl-64 flex flex-col">
            <div className="flex items-center justify-end gap-4 p-4">
              <AuthButtons />
              <ToggleTheme />
            </div>
            <main className="container mx-auto p-6 flex-1">
              {children}
              </main>
              <Footer />
            </div>
          </div>
          <CookieConsent />
        </MainProvider>
      </body>
    </html>
  );
}
