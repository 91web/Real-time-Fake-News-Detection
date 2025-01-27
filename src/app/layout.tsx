import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
//import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import "./globals.css";

//const geistSans = Geist({
 // variable: "--font-geist-sans",
 // subsets: ["latin"],
//});

//const geistMono = Geist_Mono({
 // variable: "--font-geist-mono",
 // subsets: ["latin"],
//});

export const metadata: Metadata = {
  title: "Fake News Detections",
  description: "Real-Time Fake News Detection for Nigerian Digital Platforms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
      >
     {children}
      </body>
    </html>
  );
}
