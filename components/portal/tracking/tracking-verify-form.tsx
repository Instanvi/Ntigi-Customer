"use client";

import * as React from "react";
import { Phone, ArrowRight, Package } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { portalConfig } from "@/lib/portal-config";
import { cn } from "@/lib/utils";

const trackingSchema = z.object({
  trackingNo: z
    .string()
    .min(1, "Tracking ID is required")
    .regex(/^[A-Z0-9-]+$/, "Invalid tracking ID format"),
  phoneNumber: z.string().min(8, "Phone number is required"),
});

export type TrackingFormValues = z.infer<typeof trackingSchema>;

export function TrackingVerifyForm({
  defaultValues,
  onSubmit,
  isLoading,
  className,
  variant = "card",
}: {
  defaultValues?: Partial<TrackingFormValues>;
  onSubmit: (values: TrackingFormValues) => void;
  isLoading?: boolean;
  className?: string;
  variant?: "card" | "hero";
}) {
  const { copy } = portalConfig;

  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      trackingNo: defaultValues?.trackingNo ?? "",
      phoneNumber: defaultValues?.phoneNumber ?? "",
    },
  });

  React.useEffect(() => {
    if (defaultValues?.trackingNo !== undefined) {
      form.setValue("trackingNo", defaultValues.trackingNo);
    }
    if (defaultValues?.phoneNumber !== undefined) {
      form.setValue("phoneNumber", defaultValues.phoneNumber);
    }
  }, [defaultValues?.trackingNo, defaultValues?.phoneNumber, form]);

  const isHero = variant === "hero";

  return (
    <div className={className}>
      {!isHero ? (
        <>
          <h2 className="text-sm font-normal text-slate-900">
            {copy.trackVerifyTitle}
          </h2>
          <p className="mt-1 text-sm font-normal text-slate-500">
            {copy.trackVerifySubtitle}
          </p>
        </>
      ) : null}

      {isLoading ? (
        <div className="flex flex-col items-center py-10">
          <div className="size-9 animate-spin rounded-full border-2 border-primary/15 border-t-primary" />
          <p className="mt-3 text-sm font-normal text-slate-500">
            Looking up your parcel…
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-4", isHero ? "mt-0" : "mt-5")}
          >
            <FormField
              control={form.control}
              name="trackingNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={cn(
                      "text-sm font-normal",
                      isHero ? "text-slate-700" : "text-slate-700",
                    )}
                  >
                    Tracking number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Package
                        size={18}
                        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        placeholder={copy.trackHeroPlaceholder}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm font-normal text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-slate-700">
                    Phone number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                      />
                      <PhoneInput
                        defaultCountry="CM"
                        placeholder="677 000 000"
                        value={field.value}
                        onChange={field.onChange}
                        className="h-9 min-h-9 rounded-lg border border-slate-200 bg-white pl-10 text-sm font-normal"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="portal-btn h-9 w-full rounded-lg bg-primary text-sm font-normal text-white"
            >
              {form.formState.isSubmitting ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {copy.trackVerifySubmit}
                  <ArrowRight className="ml-2" size={16} weight="bold" />
                </>
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
