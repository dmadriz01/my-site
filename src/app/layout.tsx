import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Nav from "@/components/Nav";

// ✅ Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Site metadata
export const metadata = {
  title: "David Madriz | Portfolio",
  description: "Data Science Projects, Blog, and Portfolio",
};

// ✅ Layout wrapper (applies to all pages)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script id="theme-ssr" strategy="beforeInteractive">
{`try{
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
}catch(e){}`}
</Script>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8JBJD53YG5"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8JBJD53YG5');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {/* ✅ Global navigation bar */}
        <Nav />

        {/* ✅ Main page content */}
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>

        {/* ✅ Footer (optional, can customize later) */}
        <footer className="border-t mt-12 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} David Madriz — All rights reserved.
        </footer>
      </body>
    </html>
  );
}