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
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-focus-within:from-primary/20 group-focus-within:to-primary/10 transition-all duration-200">
          <Search className="h-4 w-4 text-primary/70 group-focus-within:text-primary transition-colors" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          className={cn(
            "flex h-12 w-full rounded-2xl border-0 bg-white/90 pl-14 pr-10 py-3 text-sm font-medium text-foreground shadow-sm ring-1 ring-inset ring-border/50 transition-all duration-200 placeholder:text-muted-foreground/50 placeholder:font-normal hover:bg-white hover:ring-border hover:shadow-md focus-visible:outline-none focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:shadow-lg focus-visible:shadow-primary/5 disabled:cursor-not-allowed disabled:opacity-50",
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
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
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
