import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";
import { AppDataProvider } from "@/providers/AppDataProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-code",
});

export const metadata: Metadata = {
  title: "OpenClaw // Mission Control",
  description: "Real-time intelligence dashboard for the OpenClaw agent system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <AppDataProvider>
          <Shell>{children}</Shell>
        </AppDataProvider>
      </body>
    </html>
  );
}
