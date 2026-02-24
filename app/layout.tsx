import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/src/contexts/LanguageContext";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { UserProvider } from "@/src/contexts/UserContext";

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  preload: true,
});


export const metadata: Metadata = {
  title: "Diagnova - AI-Powered Medical Platform",
  description:
    "Your personal AI-powered health companion. Explore human anatomy, get personalized health insights in multiple languages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        <ThemeProvider>
          <LanguageProvider>
            <UserProvider>{children}</UserProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
