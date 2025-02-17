import Cabin from "@/app/cabins/[cabinId]/Cabin";
import Reservation from "@/app/cabins/[cabinId]/Reservation";
import ReservationReminder from "@/app/cabins/[cabinId]/ReservationReminder";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";
import { Metadata } from "next";

type PageParams = {
  params: Promise<{
    cabinId: string;
  }>;
};

export async function generateMetadata({ params }: PageParams) {
  const { cabinId } = await params;
  const { name, description, image } = await getCabin(+cabinId);

  return {
    title: `Cabin ${name}`,

    description,

    keywords: [
      "frontend",
      "giorgi gamgebeli",
      "react",
      "nextjs",
      `the wild oasis cabin ${name}`,
      `the wild oasis customer cabin ${name}`,
      `the wild oasis customer side cabin ${name}`,
    ],

    openGraph: {
      title: `Cabin ${name}`,

      description,

      images: [
        {
          url: image,
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
      title: `The Wild Oasis cabin ${name} | Giorgi Gamgebeli`,
      description,
      images: [image],
    },
  } satisfies Metadata;
}

export async function generateStaticParams() {
  const cabins = await getCabins();

  const ids = cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));

  return ids;
}

export default async function Page({ params }: PageParams) {
  const { cabinId } = await params;
  const cabin = await getCabin(+cabinId);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
          <ReservationReminder />
        </Suspense>
      </div>
    </div>
  );
}
