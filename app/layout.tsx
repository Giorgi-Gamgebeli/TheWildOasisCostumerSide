import { Josefin_Sans } from "next/font/google";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

import "@/app/_styles/globals.css";
import "react-day-picker/style.css";
import Header from "./_components/Header";
import ClientProviders from "./ClientProviders";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "The Wild Oasis customer side | Giorgi Gamgebeli",
    template: "%s | The Wild Oasis customer side",
  },
  description:
    "Luxurious cabins nestled in the heart of the Italian Dolomites, offering breathtaking mountain views and a serene escape surrounded by dense, dark forests. Each cabin blends rustic charm with modern comfort, featuring cozy interiors, panoramic windows, and premium amenities for an unforgettable stay in nature.",
  keywords: [
    "frontend",
    "giorgi gamgebeli",
    "react",
    "nextjs",
    "the wild oasis",
    "the wild oasis customer",
    "the wild oasis customer side",
  ],

  openGraph: {
    title: {
      default: "The Wild Oasis admin side | Giorgi Gamgebeli",
      template: "%s | The Wild Oasis",
    },
    description:
      "Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautifull mountains and dark forests.",
    images: [
      {
        url: "/landingPage.png",
        alt: "The Wild Oasis landing page",
      },
    ],
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "The Wild Oasis customer side | Giorgi Gamgebeli",
    locale: "en-US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      "max-image-preview": "large",
    },
  },

  category: "web development",

  twitter: {
    card: "summary_large_image",
    title: "The Wild Oasis customer side | Giorgi Gamgebeli",
    description:
      "Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautifull mountains and dark forests.",
    images: ["/landingPage.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} bg-primary-950 antialiased text-primary-100 min-h-screen flex flex-col relative`}
      >
        <ClientProviders>
          <Header />

          <div className="flex-1 px-8 py-12 grid">
            <main className="max-w-7xl mx-auto w-full">{children}</main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
