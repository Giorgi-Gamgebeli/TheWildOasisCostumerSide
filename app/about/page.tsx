import Image from "next/image";
import image1 from "@/public/about-1.jpg";
import image2 from "@/public/about-2.jpg";
import { getCabinsLength } from "../_lib/data-service";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",

  description:
    "Where nature's beauty and comfortable living blend seamlessly. Hidden away in the heart of the Italian Dolomites, this is your paradise away from home. But it's not just about the luxury cabins. It's about the experience of reconnecting with nature and enjoying simple pleasures with family.",
  keywords: [
    "frontend",
    "giorgi gamgebeli",
    "react",
    "nextjs",
    "the wild oasis about",
    "the wild oasis customer about",
    "the wild oasis customer about page",
  ],

  openGraph: {
    title: "About",

    description:
      "This is where memorable moments are made, surrounded by nature's splendor. It's a place to slow down, relax, and feel the joy of being together in a beautiful setting.",
    images: [
      {
        url: "/aboutPage.png",
        alt: "The Wild Oasis about page",
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
    title: "The Wild Oasis about page | Giorgi Gamgebeli",
    description:
      "This is where memorable moments are made, surrounded by nature's splendor. It's a place to slow down, relax, and feel the joy of being together in a beautiful setting.",
    images: ["/aboutPage.png"],
  },
};

async function Page() {
  const cabinsLength = await getCabinsLength();

  return (
    <div className="grid grid-cols-5 items-center gap-x-24 gap-y-32 text-lg">
      <div className="col-span-3">
        <h1 className="mb-10 text-4xl font-medium text-accent-400">
          Welcome to The Wild Oasis
        </h1>

        <div className="space-y-8">
          <p>
            Where nature&apos;s beauty and comfortable living blend seamlessly.
            Hidden away in the heart of the Italian Dolomites, this is your
            paradise away from home. But it&apos;s not just about the luxury
            cabins. It&apos;s about the experience of reconnecting with nature
            and enjoying simple pleasures with family.
          </p>
          <p>
            Our {cabinsLength} luxury cabins provide a cozy base, but the real
            freedom and peace you&apos;ll find in the surrounding mountains.
            Wander through lush forests, breathe in the fresh air, and watch the
            stars twinkle above from the warmth of a campfire or your hot tub.
          </p>
          <p>
            This is where memorable moments are made, surrounded by
            nature&apos;s splendor. It&apos;s a place to slow down, relax, and
            feel the joy of being together in a beautiful setting.
          </p>
        </div>
      </div>

      <div className="relative col-span-2 aspect-square">
        <Image
          src={image1}
          fill
          alt="Family sitting around a fire pit in front of cabin"
          placeholder="blur"
          className="object-cover"
          quality={80}
          sizes="35vw"
        />
      </div>

      <div className="relative col-span-2 aspect-square">
        <Image
          src={image2}
          quality={80}
          sizes="35vw"
          fill
          className="object-cover"
          placeholder="blur"
          alt="Family that manages The Wild Oasis"
        />
      </div>

      <div className="col-span-3">
        <h1 className="mb-10 text-4xl font-medium text-accent-400">
          Managed by our family since 1962
        </h1>

        <div className="space-y-8">
          <p>
            Since 1962, The Wild Oasis has been a cherished family-run retreat.
            Started by our grandparents, this haven has been nurtured with love
            and care, passing down through our family as a testament to our
            dedication to creating a warm, welcoming environment.
          </p>
          <p>
            Over the years, we&apos;ve maintained the essence of The Wild Oasis,
            blending the timeless beauty of the mountains with the personal
            touch only a family business can offer. Here, you&apos;re not just a
            guest; you&apos;re part of our extended family. So join us at The
            Wild Oasis soon, where tradition meets tranquility, and every visit
            is like coming home.
          </p>

          <div>
            <Link
              href="/cabins"
              className="mt-4 inline-block bg-accent-500 px-8 py-5 text-lg font-semibold text-primary-800 transition-all hover:bg-accent-600"
            >
              Explore our luxury cabins
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
