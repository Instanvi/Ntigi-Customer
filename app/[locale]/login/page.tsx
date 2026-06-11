"use client";

import * as React from "react";
import { useRouter } from "@/lib/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/hooks/use-session";
import {
  useClientAppLoginStart,
  useClientAppResendOtp,
  useLogin,
} from "@/hooks/api/use-auth";
import { useOffline } from "@/hooks/use-offline";
import { WifiOff, ArrowRight } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import { AuthLanguageToggle } from "@/components/auth/auth-language-toggle";
import { AuthBrandLogo } from "@/components/auth/auth-brand-logo";
import { ClientOtpInput } from "@/components/auth/client-otp-input";
import { isAxiosError } from "axios";
import { AGENCY_SLUG_CONFIG_ERROR } from "@/lib/http/client-app-auth-headers";
import { agencySlug } from "@/lib/agency-config";
import { maskIdentifier } from "@/lib/core/utils";

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Identifier is required")
    .refine((val) => {
      const isEmail = z.string().email().safeParse(val).success;
      const isPhone = isValidPhoneNumber(val);
      return isEmail || isPhone;
    }, "Enter a valid email or phone number"),
});

const RESEND_SECONDS = 30;
const STORED_IDENTIFIER_KEY = "customer_login_identifier";

export default function LoginPage() {
  const tLogin = useTranslations("auth.login");
  const tVerify = useTranslations("auth.verify");
  const router = useRouter();
  const isOffline = useOffline();
  const { user, isLoading: sessionLoading } = useSession();
  const [mode, setMode] = React.useState<"phone" | "email">("phone");
  const [step, setStep] = React.useState<"identifier" | "otp">("identifier");
  const [pendingIdentifier, setPendingIdentifier] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [counter, setCounter] = React.useState(RESEND_SECONDS);
  const [canResend, setCanResend] = React.useState(false);
  const lastAutoSubmittedCodeRef = React.useRef("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "" },
  });

  React.useEffect(() => {
    if (!sessionLoading && user?.role === "CLIENT") {
      router.push("/dashboard");
    }
  }, [user, sessionLoading, router]);

  React.useEffect(() => {
    const stored = sessionStorage.getItem(STORED_IDENTIFIER_KEY);
    if (!stored?.trim()) return;
    sessionStorage.removeItem(STORED_IDENTIFIER_KEY);
    form.setValue("identifier", stored);
  }, [form]);

  React.useEffect(() => {
    if (step !== "otp") return;

    setCounter(RESEND_SECONDS);
    setCanResend(false);
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, pendingIdentifier]);

  const loginStartMutation = useClientAppLoginStart();
  const resendOtpMutation = useClientAppResendOtp();
  const loginMutation = useLogin();

  function resetToIdentifier() {
    setStep("identifier");
    setPendingIdentifier("");
    setOtpCode("");
    lastAutoSubmittedCodeRef.current = "";
  }

  function submitOtp(code: string) {
    if (!pendingIdentifier || code.length !== 6) return;

    loginMutation.mutate(
      { identifier: pendingIdentifier, password: "otp:" + code },
      {
        onSuccess: () => {
          toast.success("Login successful");
          router.push("/dashboard");
        },
        onError: (err: Error) => {
          const staffUrl = process.env.NEXT_PUBLIC_STAFF_APP_URL;
          const msg = err.message || "Invalid verification code";
          if (msg.includes("agency staff") && staffUrl) {
            toast.error(msg, {
              action: {
                label: "Staff portal",
                onClick: () => window.open(staffUrl, "_blank"),
              },
            });
          } else {
            toast.error(msg);
          }
          setOtpCode("");
          lastAutoSubmittedCodeRef.current = "";
        },
      },
    );
  }

  React.useEffect(() => {
    const code = otpCode.replace(/\D/g, "").slice(0, 6);
    if (step !== "otp" || code.length !== 6) {
      lastAutoSubmittedCodeRef.current = "";
      return;
    }
    if (loginMutation.isPending) return;
    if (lastAutoSubmittedCodeRef.current === code) return;
    lastAutoSubmittedCodeRef.current = code;
    submitOtp(code);
  }, [otpCode, step, loginMutation.isPending, pendingIdentifier]);

  function onSubmitIdentifier(values: z.infer<typeof loginSchema>) {
    if (isOffline) return;
    if (!agencySlug?.trim()) {
      toast.error(AGENCY_SLUG_CONFIG_ERROR);
      return;
    }
    loginStartMutation.mutate(values.identifier, {
      onSuccess: (result) => {
        if (!result?.exists) {
          form.setError("identifier", { message: "Account not found" });
          toast.error("Account not found");
          return;
        }

        toast.success("Verification code sent");
        setPendingIdentifier(values.identifier);
        setOtpCode("");
        lastAutoSubmittedCodeRef.current = "";
        setStep("otp");
      },
      onError: (err: unknown) => {
        const staffUrl = process.env.NEXT_PUBLIC_STAFF_APP_URL;
        if (err instanceof Error && err.message === AGENCY_SLUG_CONFIG_ERROR) {
          toast.error(err.message);
          return;
        }
        if (err instanceof Error && err.message.includes("unavailable")) {
          toast.error(err.message);
          return;
        }
        if (isAxiosError(err) && err.response?.status === 403) {
          const msg =
            (err.response?.data as { error?: string })?.error ||
            "This account is for agency staff.";
          toast.error(msg, {
            action: staffUrl
              ? {
                  label: "Staff portal",
                  onClick: () => window.open(staffUrl, "_blank"),
                }
              : undefined,
          });
          return;
        }
        toast.error("Verification failed. Please try again.");
      },
    });
  }

  const handleResend = () => {
    if (!pendingIdentifier || !canResend) return;

    resendOtpMutation.mutate(pendingIdentifier, {
      onSuccess: () => {
        toast.success("A new verification code has been sent.");
        setCounter(RESEND_SECONDS);
        setCanResend(false);
      },
      onError: () => {
        toast.error("Failed to resend the verification code. Please try again.");
      },
    });
  };

  const isPending =
    loginStartMutation.isPending ||
    loginMutation.isPending ||
    resendOtpMutation.isPending;

  return (
    <div className="flex min-h-dvh flex-col bg-white px-5 pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="flex flex-1 flex-col justify-center pb-8">
        <div className="mx-auto w-full max-w-sm">
          <AuthBrandLogo />

          {step === "identifier" ? (
            <>
              <div className="mb-6">
                <h1 className="text-center text-lg font-semibold tracking-tight text-black">
                  {tLogin("title")}
                </h1>
                <p className="mt-1 text-center text-[13px] text-black/60">
                  {tLogin("subtitle")}
                </p>
              </div>

              {isOffline && (
                <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                  <WifiOff className="shrink-0 text-amber-600" size={16} />
                  <p className="text-xs text-amber-800">
                    You must be online to sign in.
                  </p>
                </div>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitIdentifier)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-1.5 flex items-baseline justify-between">
                          <label className="text-[13px] font-medium text-black/60">
                            {mode === "phone"
                              ? tLogin("phoneNumber")
                              : tLogin("email")}
                          </label>
                          <button
                            type="button"
                            className="text-[11px] font-medium text-primary"
                            onClick={() => {
                              setMode(mode === "phone" ? "email" : "phone");
                              form.setValue("identifier", "");
                              form.clearErrors("identifier");
                            }}
                          >
                            {mode === "phone"
                              ? `Use ${tLogin("email").toLowerCase()}`
                              : `Use ${tLogin("phoneNumber").toLowerCase()}`}
                          </button>
                        </div>

                        <FormControl>
                          {mode === "phone" ? (
                            <PhoneInput
                              defaultCountry="CM"
                              placeholder="6XX XXX XXX"
                              disabled={isOffline}
                              className="h-11 min-h-11 rounded-lg shadow-none"
                              {...field}
                              value={field.value}
                            />
                          ) : (
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              disabled={isOffline}
                              className="h-11 rounded-lg px-3 text-sm text-black shadow-none"
                              {...field}
                              value={field.value}
                            />
                          )}
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    variant="ideal"
                    disabled={isOffline || loginStartMutation.isPending}
                    className="h-11 w-full rounded-lg text-[13px] font-semibold"
                  >
                    {loginStartMutation.isPending ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        <span>{tLogin("verifyAccount")}</span>
                        <ArrowRight size={16} className="ml-1" />
                      </>
                    )}
                  </Button>

                  <AuthLanguageToggle className="pt-3" />
                </form>
              </Form>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-center text-lg font-semibold tracking-tight text-black">
                  {pendingIdentifier.includes("@")
                    ? tVerify("checkEmail")
                    : tVerify("checkPhone")}
                </h1>
                <p className="mt-1 text-center text-[13px] text-black/60">
                  {tVerify("subtitle")}{" "}
                  <span className="font-semibold text-[#263070]">
                    {maskIdentifier(pendingIdentifier)}
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="mb-3 text-center text-[13px] font-medium text-black/60">
                    {tVerify("code")}
                  </p>
                  <ClientOtpInput
                    value={otpCode}
                    onChange={setOtpCode}
                    disabled={isPending}
                  />
                </div>

                {loginMutation.isPending ? (
                  <div
                    className="flex items-center justify-center gap-2 text-xs font-semibold text-[#263070]"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#263070]/25 border-t-[#263070]" />
                    <span>{tVerify("verifying")}</span>
                  </div>
                ) : null}

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend || resendOtpMutation.isPending}
                    className="text-xs font-semibold text-[#263070] transition-colors hover:underline disabled:text-black/30"
                  >
                    {resendOtpMutation.isPending
                      ? tVerify("sending")
                      : canResend
                        ? tVerify("resend")
                        : tVerify("resendIn", { seconds: counter })}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={resetToIdentifier}
                  disabled={isPending}
                  className="w-full text-center text-[13px] font-medium text-[#263070] hover:underline disabled:opacity-50"
                >
                  {tVerify("back")}
                </button>

                <AuthLanguageToggle className="pt-1" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
