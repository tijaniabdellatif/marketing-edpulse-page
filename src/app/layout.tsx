import type { Metadata } from "next";
import { Raleway, Mulish } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway-sans",
  subsets: ["latin"],
});

const mulish = Mulish({
  variable: "--font-mulish-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "edpulse language learning",
  description: "Edpulse language learning is an AI-powered website that keeps learners eager to explore it",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords:[
    "edpulse",
    "learning",
    "languages",
    "english",
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} ${mulish.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
