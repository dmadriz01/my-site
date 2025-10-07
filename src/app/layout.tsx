import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "David Madriz | Portfolio",
  description: "Data Science Projects, Blog, and Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  );
}
