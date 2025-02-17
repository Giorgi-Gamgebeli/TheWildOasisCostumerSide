"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import defaultAvatar from "@/public/default-user.jpg";

function AccountLink() {
  const { data } = useSession();

  return (
    <Link
      href="/account"
      className={`flex items-center gap-2 transition-colors hover:text-accent-400 ${data?.user}`}
    >
      <div className="relative h-8 w-8">
        {data?.user && (
          <div className="relative col-span-2 aspect-square">
            <Image
              quality={80}
              sizes="10vw"
              fill
              className="rounded-full"
              src={data?.user?.image || defaultAvatar}
              alt={data?.user?.name || "User image"}
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      <span>Guest area</span>
    </Link>
  );
}

export default AccountLink;
