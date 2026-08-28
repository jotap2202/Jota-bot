import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "neutral" | "info";
  children: React.ReactNode;
}

export function Badge({ variant = "neutral", children }: BadgeProps) {
  const variants = {
    success: "bg-status-success/10 text-status-success border border-status-success/20",
    warning: "bg-status-warning/10 text-status-warning border border-status-warning/20",
    danger: "bg-status-danger/10 text-status-danger border border-status-danger/20",
    neutral: "bg-neutral-100 text-neutral-700 border border-neutral-200",
    info: "bg-brand-50 text-brand-700 border border-brand-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
