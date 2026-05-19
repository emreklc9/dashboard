import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cordelio Dashboard",
  description: "Modern dashboard uygulaması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} h-full`}>
      <body className="h-full bg-zinc-50 dark:bg-zinc-950 antialiased">
        <AppProvider>
          <AuthProvider>{children}</AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
