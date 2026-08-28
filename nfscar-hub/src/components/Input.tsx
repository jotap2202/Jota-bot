import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400",
            "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0 focus:border-brand-500",
            "transition-colors duration-150",
            error && "border-status-danger focus:ring-status-danger focus:border-status-danger",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-status-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
