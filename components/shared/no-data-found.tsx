"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
interface NoDataFoundProps {
  title?: string;
  description?: string;
  icon?: "inbox" | "search" | "shipment";
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function NoDataFound({
  title = "No data found",
  description = "There are no records to display at the moment.",
  icon = "inbox",
  actionLabel,
  onAction,
  className,
}: NoDataFoundProps) {

  return (
    <div
      className={`flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-500 ${className || ""}`}
    >
      <div className="mb-6 flex items-center justify-center">
        <Image
          src="/logo.svg"
          alt="Ntigi"
          width={48}
          height={48}
          className="h-10 w-auto"
        />
      </div>
      <h3 className="text-lg font-medium text-black mb-2">{title}</h3>
      <p className="text-sm text-black/40 max-w-xs mx-auto leading-relaxed mb-8">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          className="h-10 px-6 border-[#EEEEEE] rounded-[4px] font-semibold text-black hover:bg-black/5 flex items-center gap-2"
        >
          <Plus size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
