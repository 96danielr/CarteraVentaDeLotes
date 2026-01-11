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
          "flex h-11 w-full rounded-xl border-0 bg-white/80 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-inset ring-border/60 transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-muted-foreground/60 placeholder:font-normal hover:bg-white hover:ring-border focus-visible:outline-none focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:shadow-[0_0_0_4px_hsl(234_89%_64%/0.1)] disabled:cursor-not-allowed disabled:opacity-50",
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
