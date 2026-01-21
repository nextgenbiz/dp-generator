import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/componenet/Header";
import Footer from "@/componenet/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Next-Gen Profile Studio | Professional DP Generator",
  description:
    "Create and customize your professional company profile picture with the Next-Gen internal branding tool.",
  openGraph: {
    title: "Next-Gen Profile Studio",
    description:
      "Innovating Tomorrow, Today. Generate your official employee profile picture.",
    url: "https://dp-generator-rosy.vercel.app",
    siteName: "Next-Gen Business Consultancy Private Limited",
    images: [
      {
        url: "https://dp-generator-rosy.vercel.app/og-image.jpg", // Ensure this path is correct
        width: 1200,
        height: 630,
        alt: "Next-Gen Profile Studio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next-Gen Profile Studio",
    description:
      "Internal tool for Next-Gen employees to generate professional DPs.",
    images: ["https://dp-generator-rosy.vercel.app/og-image.jpg"],
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <main className="min-h-screen">{children}</main>

      </body>
    </html>
  );
}
