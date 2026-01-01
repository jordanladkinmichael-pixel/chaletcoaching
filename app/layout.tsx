import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import Providers from "./providers";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const title = "Chalet Coaching | AI-powered fitness courses";
const description =
  "Build and follow personalized, coach-quality training plans powered by AI. Safe, structured, and ready to deploy.";
const ogImage = "/android-chrome-512x512.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://chaletcoaching.co.uk"),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title,
    description,
    url: "https://chaletcoaching.co.uk",
    siteName: "Chalet Coaching",
    images: [
      {
        url: ogImage,
        width: 512,
        height: 512,
        alt: "Chalet Coaching",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${inter.className} bg-bg text-text`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
