import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-heading font-medium tracking-wide transition-all duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-primary to-[hsl(var(--glow-secondary))] text-primary-foreground border border-primary/50 shadow-[0_0_20px_hsl(var(--glow-primary)/0.25),inset_0_1px_0_hsl(0_0%_100%/0.15)] hover:-translate-y-0.5 hover:shadow-[0_0_40px_hsl(var(--glow-primary)/0.4),0_8px_30px_hsl(var(--glow-primary)/0.2)]",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/30 backdrop-blur-xl hover:bg-destructive/20",
        outline:
          "bg-[hsl(var(--surface-glass)/0.4)] backdrop-blur-xl border border-[hsl(var(--border)/0.4)] text-foreground/90 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.06)] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[hsl(var(--surface-glass)/0.6)]",
        secondary:
          "bg-secondary text-secondary-foreground border border-border/30 hover:bg-secondary/80",
        ghost:
          "text-foreground/70 hover:text-foreground hover:bg-white/5 border border-transparent hover:border-border/30",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8",
        icon: "h-9 w-9",
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
