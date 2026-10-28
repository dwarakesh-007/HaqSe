import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HaqSe - Know your rights",
  description: "Free legal guidance in simple words, for everyone in India.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <a href="/" className="logo">
            Haq<span>Se</span>
          </a>
          <span className="tag">Know your rights</span>
        </header>
        <main>{children}</main>
        <footer className="footer">
          HaqSe gives general legal information, not legal advice. For serious cases, contact your
          District Legal Services Authority (DLSA) for free legal aid. In danger? Call 112.
        </footer>
      </body>
    </html>
  );
}
