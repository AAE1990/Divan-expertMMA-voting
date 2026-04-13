import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../shared/styles/globals.css";
import { MainProvider } from "../shared/providers";
import { Sidebar, ToggleTheme } from "../shared/components/ui";

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
          <div className="flex-1 pl-64">
            <div className="flex justify-end p-4"> 
              <ToggleTheme />
            </div>
            <main className="container mx-auto p-6">
              {children}
              </main>
            </div>
          </div>
        </MainProvider>
      </body>
    </html>
  );
}
