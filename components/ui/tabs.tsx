"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextType {
  value?: string
  defaultValue?: string
  selectedValue: string
  setSelectedValue: (val: string) => void
  variant?: "line" | "background" | "default"
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  variant?: "line" | "background" | "default"
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  variant = "default",
  className,
  children,
  ...props
}: TabsProps) {
  const [localValue, setLocalValue] = React.useState(value ?? defaultValue ?? "")

  React.useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value)
    }
  }, [value])

  const setSelectedValue = React.useCallback(
    (val: string) => {
      if (value === undefined) {
        setLocalValue(val)
      }
      onValueChange?.(val)
    },
    [value, onValueChange]
  )

  return (
    <TabsContext.Provider
      value={{
        value,
        defaultValue,
        selectedValue: localValue,
        setSelectedValue,
        variant,
      }}
    >
      <div className={cn("w-full flex flex-col gap-4", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "background" | "default"
}

export function TabsList({ className, children, variant: propVariant, ...props }: TabsListProps) {
  const context = React.useContext(TabsContext)
  const variant = propVariant ?? context?.variant ?? "default"

  return (
    <div
      className={cn(
        "inline-flex items-center w-full",
        variant === "line"
          ? "border-b border-slate-200 dark:border-slate-800 gap-6 bg-transparent pb-0"
          : "bg-slate-100/80 dark:bg-slate-800/80 p-1 gap-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner w-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({ className, value, children, disabled, ...props }: TabsTriggerProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")

  const isActive = context.selectedValue === value
  const variant = context.variant ?? "default"

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => context.setSelectedValue(value)}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[14px] font-medium whitespace-nowrap transition-all duration-200 select-none outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        // Line variant styling
        variant === "line" && [
          "pb-3 pt-2 bg-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
          isActive && "text-[#263070] dark:text-blue-400 font-semibold",
          // bottom solid line indicator
          "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#263070] dark:after:bg-blue-400 after:transition-transform after:duration-200",
          isActive ? "after:scale-x-100" : "after:scale-x-0"
        ],
        // Background / Pill variant styling
        (variant === "background" || variant === "default") && [
          "rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
          isActive ? "bg-white dark:bg-slate-700 text-[#263070] dark:text-blue-400 shadow-sm font-semibold" : "bg-transparent"
        ],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ className, value, children, ...props }: TabsContentProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be used within Tabs")

  const isActive = context.selectedValue === value

  if (!isActive) return null

  return (
    <div
      className={cn(
        "flex-1 outline-none transition-opacity duration-200",
        isActive ? "opacity-100" : "opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
