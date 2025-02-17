"use client";

import { useSearchParams } from "next/navigation";
import CabinCard from "./CabinCard";

type CabinListProps = {
  cabins: {
    id: number;
    name: string;
    maxCapacity: number;
    regularPrice: number;
    discount: number;
    image: string;
  }[];
};

function CabinList({ cabins }: CabinListProps) {
  const searchParams = useSearchParams();

  const filter = searchParams.get("capacity") ?? "all";

  if (!cabins.length) return null;

  let displayCabins = cabins;

  if (filter === "small")
    displayCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  if (filter === "medium")
    displayCabins = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
    );
  if (filter === "large")
    displayCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
