import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative group">
        <select
          className={cn(
            "flex h-11 w-full cursor-pointer appearance-none rounded-xl border-0 bg-white/5 px-4 py-2.5 pr-10 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all duration-200",
            "hover:bg-white/10 hover:ring-white/20",
            "focus-visible:outline-none focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:shadow-[0_0_20px_hsl(160_84%_39%/0.15)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&>option]:bg-slate-800 [&>option]:text-white",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
          <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
        </div>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
