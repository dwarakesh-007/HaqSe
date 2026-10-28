import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HaqSe - Know your rights",
  description: "Free legal guidance in simple words, for everyone in India.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16233F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Latin:wdth,wght@75..125,400..800&family=Anek+Telugu:wght@400..700&family=Anek+Devanagari:wght@400..700&family=Noto+Serif:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="topbar">
          <a href="/" className="wordmark" aria-label="HaqSe home">
            HaqSe
          </a>
          <span className="topbar-note">Free legal help in simple words</span>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <p>
            HaqSe gives general legal information, not legal advice. For serious cases, your District Legal Services
            Authority (DLSA) gives free legal aid. In danger? Call <a href="tel:112">112</a>.
          </p>
        </footer>
      </body>
    </html>
  );
}
