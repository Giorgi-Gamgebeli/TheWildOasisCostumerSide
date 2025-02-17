import { MetadataRoute } from "next";
import { getCabins } from "./_lib/data-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cabins = await getCabins();

  const urlsForCabins: MetadataRoute.Sitemap = cabins.flatMap((cabin) => [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/cabins/${cabin.id}`,
    },
  ]);

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/cabins`,
    },
    ...urlsForCabins,
  ];
}
