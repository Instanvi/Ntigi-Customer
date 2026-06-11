"use client";

import {
  CheckCircle,
  Info,
  Spinner,
  Warning,
  XCircle,
} from "@phosphor-icons/react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const incomingClassNames = props.toastOptions?.classNames;

  return (
    <Sonner
      {...props}
      className="toaster group"
      richColors
      icons={{
        success: <CheckCircle className="size-4" />,
        info: <Info className="size-4" />,
        warning: <Warning className="size-4" />,
        error: <XCircle className="size-4" />,
        loading: <Spinner className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "0.75rem",
        } as React.CSSProperties
      }
      toastOptions={{
        ...props.toastOptions,
        classNames: {
          ...incomingClassNames,
          toast:
            "rounded-xl border shadow-md font-sans " +
            (incomingClassNames?.toast ?? ""),
          success:
            "bg-emerald-600 text-white border-emerald-700 " +
            (incomingClassNames?.success ?? ""),
          error:
            "bg-red-600 text-white border-red-700 " +
            (incomingClassNames?.error ?? ""),
        },
      }}
    />
  );
};

export { Toaster };
