"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAgencyBrand } from "@/components/providers/agency-brand-provider";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const { displayName, logoUrl } = useAgencyBrand();
  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed =
        (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceDismissed < 7) {
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
    setShowPrompt(false);
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500 md:left-auto md:right-4 md:max-w-md">
      <div className="rounded-lg border border-[#EEEEEE] bg-white p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#EEEEEE] bg-white">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={displayName}
                width={36}
                height={36}
                className="object-contain"
                unoptimized
              />
            ) : (
              <Image src="/logo.svg" alt={displayName} width={36} height={36} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="mb-1 text-base font-semibold text-black">
              Install {displayName}
            </h3>
            <p className="mb-3 text-sm text-black/60">
              Install our app for faster access and offline support
            </p>

            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                className="h-9 flex-1 rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary/90"
              >
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="h-9 flex-1 rounded-md border-[#EEEEEE] text-sm font-semibold"
              >
                Not now
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 text-black/40 transition-colors hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
