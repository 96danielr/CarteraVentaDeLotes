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
            "flex h-11 w-full cursor-pointer appearance-none rounded-xl border-0 bg-white/80 px-4 py-2.5 pr-10 text-sm font-medium text-foreground shadow-sm ring-1 ring-inset ring-border/60 transition-all duration-200 hover:bg-white hover:ring-border focus-visible:outline-none focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:shadow-[0_0_0_4px_hsl(234_89%_64%/0.1)] disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-md bg-muted/50 group-hover:bg-muted transition-colors">
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
