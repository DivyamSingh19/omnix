import type { Metadata } from "next";
import { Inter,Manrope } from "next/font/google";
import "./globals.css";


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
})
export const metadata: Metadata = {
  title: "Omnix",
  description: "AI DAO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${manrope.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
