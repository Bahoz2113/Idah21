import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-hepsenBlue/10 text-hepsenBlue",
      low: "bg-risk-low/10 text-risk-low",
      medium: "bg-risk-medium/10 text-risk-medium",
      high: "bg-risk-high/10 text-risk-high",
      blocked: "bg-risk-blocked/10 text-risk-blocked",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
