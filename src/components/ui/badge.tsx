import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        secondary: "bg-white/5 text-slate-300 border border-white/10",
        destructive: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        outline: "border border-white/10 bg-transparent text-slate-300",
        success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_hsl(160_84%_39%/0.1)]",
        warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_hsl(45_93%_58%/0.1)]",
        info: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_hsl(188_94%_43%/0.1)]",
        purple: "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_hsl(270_76%_60%/0.1)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
