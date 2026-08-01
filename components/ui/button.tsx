import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 border border-zinc-900/10 dark:border-white/20",
        primary:
          "bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white dark:from-white dark:via-zinc-100 dark:to-white dark:text-zinc-950 shadow-md hover:shadow-lg hover:shadow-zinc-900/20 dark:hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0 border border-zinc-800 dark:border-white/30 font-bold uppercase tracking-wider",
        secondary:
          "bg-zinc-100 text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700/60 shadow-2xs hover:-translate-y-0.5 active:translate-y-0",
        accent:
          "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 hover:bg-emerald-700 dark:hover:bg-emerald-400 shadow-md hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0 font-bold uppercase tracking-wider border border-emerald-500/30",
        outline:
          "border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 backdrop-blur-xs shadow-2xs hover:-translate-y-0.5 active:translate-y-0",
        ghost:
          "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white transition-colors",
        destructive:
          "bg-red-600 text-white dark:bg-red-500 dark:text-zinc-950 hover:bg-red-700 dark:hover:bg-red-400 shadow-sm hover:shadow-red-500/20 hover:-translate-y-0.5 active:translate-y-0 font-semibold",
        link: "text-zinc-900 dark:text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 text-sm",
        sm: "h-8.5 px-3.5 text-xs rounded-md",
        lg: "h-12 px-7 text-sm rounded-xl font-bold tracking-wide",
        xl: "h-14 px-9 text-base rounded-xl font-extrabold tracking-wider",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
