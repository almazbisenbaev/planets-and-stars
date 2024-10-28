import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./styles.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Planets and Stars by @almazbisenbaev",
  description: "A playground that lets you accurately compare different celestial bodies in size",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

          <div id="stars-container">
            <div id='stars1'></div>
            <div id='stars2'></div>
            <div id='stars3'></div>
          </div>

          {children}

      </body>
    </html>
  );
}
