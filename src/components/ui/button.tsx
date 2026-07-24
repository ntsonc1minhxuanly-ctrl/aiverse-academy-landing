import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "success";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
          {
            "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100": variant === "default",
            "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-100": variant === "destructive",
            "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950": variant === "outline",
            "bg-slate-100 text-slate-900 hover:bg-slate-200": variant === "secondary",
            "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100": variant === "success",
            "hover:bg-slate-100 hover:text-slate-900": variant === "ghost",
            "text-indigo-600 underline-offset-4 hover:underline p-0 h-auto bg-transparent": variant === "link",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-lg px-3 text-xs": size === "sm",
            "h-12 rounded-xl px-8 text-base": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
