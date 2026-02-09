import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/src/contexts/LanguageContext";
import { ThemeProvider } from "@/src/contexts/ThemeContext";

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  preload: true,
});


export const metadata: Metadata = {
  title: "Body Help - Interactive 3D Medical Visualization",
  description:
    "Explore human anatomy in 3D. Learn about medical conditions, symptoms, and treatments for different body parts.",
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
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
