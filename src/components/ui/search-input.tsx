import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, X } from "lucide-react"

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, ...props }, ref) => {
    const hasValue = value && String(value).length > 0

    return (
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/20 group-focus-within:from-emerald-500/30 group-focus-within:to-emerald-500/20 group-focus-within:border-emerald-500/30 transition-all duration-200">
          <Search className="h-4 w-4 text-emerald-400 group-focus-within:text-emerald-300 transition-colors" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          className={cn(
            "flex h-12 w-full rounded-2xl border-0 bg-white/5 pl-14 pr-10 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all duration-200",
            "placeholder:text-slate-500 placeholder:font-normal",
            "hover:bg-white/10 hover:ring-white/20",
            "focus-visible:outline-none focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:shadow-[0_0_30px_hsl(160_84%_39%/0.15)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />

        {/* Clear Button */}
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 hover:border-white/10 transition-all duration-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
