import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border-0 bg-white/5 px-4 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-emerald-400",
          "placeholder:text-slate-500 placeholder:font-normal",
          "hover:bg-white/10 hover:ring-white/20",
          "focus-visible:outline-none focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:shadow-[0_0_20px_hsl(160_84%_39%/0.15)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
