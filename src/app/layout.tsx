import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkySearch - Flight Search Engine",
  description: "Find the best flights at the lowest prices with our intelligent flight search engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {children}
      </body>
    </html>
  );
}
