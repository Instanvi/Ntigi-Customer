"use client";

import Image from "next/image";
import { Link } from "@/lib/navigation";
import { useAgencyBrand } from "@/components/providers/agency-brand-provider";

export function AuthBrandLogo({ className }: { className?: string }) {
  const { logoUrl, displayName } = useAgencyBrand();

  return (
    <div className={className ?? "mb-8 flex justify-center"}>
      <Link href="/">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={displayName || "Logo"}
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
            priority
            unoptimized
          />
        ) : (
          <span className="text-2xl font-black tracking-tight text-primary">
            {displayName}
          </span>
        )}
      </Link>
    </div>
  );
}
