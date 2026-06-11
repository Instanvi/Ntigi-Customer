"use client";

import * as React from "react";
import { CaretUpDown, Check } from "@phosphor-icons/react";
import * as RPNI from "react-phone-number-input";
import { CircleFlag } from "react-circle-flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

export type PhoneInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  RPNI.Props<React.ComponentProps<typeof Input>>;

const DEFAULT_COUNTRY: RPNI.Country = "CM";

const PhoneInput = React.forwardRef<
  React.ElementRef<typeof RPNI.default>,
  PhoneInputProps
>(({ className, onChange, value, defaultCountry = DEFAULT_COUNTRY, ...props }, ref) => {
  return (
    <RPNI.default
      ref={ref}
      className={cn(
        "flex h-10 min-h-10 w-full overflow-hidden rounded-lg border border-border bg-white shadow-none transition-[color,box-shadow] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:bg-input/30",
        className,
      )}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      defaultCountry={defaultCountry}
      onChange={(v) =>
        (onChange as unknown as (value: string) => void)?.(v || "")
      }
      value={(value as RPNI.Value) || undefined}
      {...props}
    />
  );
});
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    className={cn(
      "h-full min-h-0 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent",
      className,
    )}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNI.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNI.Country;
  onChange: (value: RPNI.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const [search, setSearch] = React.useState("");
  const filteredOptions = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) ||
        option.value.toLowerCase().includes(q) ||
        RPNI.getCountryCallingCode(option.value).includes(q.replace("+", "")),
    );
  }, [options, search]);

  const handleSelect = React.useCallback(
    (country: RPNI.Country) => {
      onChange(country);
    },
    [onChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "flex h-full min-h-0 gap-1 rounded-none border-0 border-r border-border px-3 shadow-none hover:bg-black/3 focus-visible:ring-0 dark:hover:bg-white/5",
          )}
          disabled={disabled}
        >
          <FlagComponent
            country={value ?? DEFAULT_COUNTRY}
            countryName={value ?? DEFAULT_COUNTRY}
          />
          <CaretUpDown
            className={cn(
              "-mr-2 h-4 w-4 opacity-70",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <div className="border-b border-border p-2">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by country, code, or dialing code"
              className="h-10 rounded-lg border-border text-sm shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions
                .filter((x) => x.value)
                .map((option) => (
                  <CommandItem
                    className="gap-2"
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <FlagComponent
                      country={option.value}
                      countryName={option.label}
                    />
                    <span className="flex-1 text-sm">{option.label}</span>
                    {option.value && (
                      <span className="text-foreground/50 text-sm">
                        {`+${RPNI.getCountryCallingCode(option.value)}`}
                      </span>
                    )}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        option.value === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNI.FlagProps) => {
  const code =
    typeof country === "string" && country.trim()
      ? country.trim().toLowerCase()
      : DEFAULT_COUNTRY.toLowerCase();

  return (
    <span className="inline-flex h-5 w-5 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
      <CircleFlag
        countryCode={code}
        height={20}
        title={countryName ?? code.toUpperCase()}
      />
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
