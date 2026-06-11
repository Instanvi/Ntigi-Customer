"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

export type ClientOtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function ClientOtpInput({
  value,
  onChange,
  disabled,
  className,
  "aria-label": ariaLabel = "Verification code",
}: ClientOtpInputProps) {
  const digits = React.useMemo(() => {
    const raw = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    return Array.from({ length: OTP_LENGTH }, (_, i) => raw[i] ?? "");
  }, [value]);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const setDigits = React.useCallback(
    (next: string[]) => {
      onChange(next.join("").replace(/\D/g, "").slice(0, OTP_LENGTH));
    },
    [onChange],
  );

  const focusIndex = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const applyPasted = (text: string, startIndex: number) => {
    const chars = text.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    if (chars.length === 0) return;
    const next = [...digits];
    let i = startIndex;
    for (const c of chars) {
      if (i >= OTP_LENGTH) break;
      next[i] = c;
      i += 1;
    }
    setDigits(next);
    focusIndex(Math.min(i, OTP_LENGTH - 1));
  };

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    if (!digit) {
      next[index] = "";
      setDigits(next);
      return;
    }
    next[index] = digit;
    setDigits(next);
    if (index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        focusIndex(index - 1);
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
      }
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowLeft" && index > 0) {
      focusIndex(index - 1);
      e.preventDefault();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
      e.preventDefault();
    }
  };

  return (
    <div
      className={cn("flex justify-center gap-2", className)}
      role="group"
      aria-label={ariaLabel}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          className={cn(
            "h-11 w-10 border border-[#EEEEEE] bg-white text-center text-xl font-semibold text-black shadow-none outline-none transition-colors",
            "focus:border-primary focus:ring-2 focus:ring-primary/15",
            digit && "border-primary/40",
            disabled && "cursor-not-allowed opacity-50",
          )}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => {
            e.preventDefault();
            applyPasted(e.clipboardData.getData("text"), index);
          }}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
