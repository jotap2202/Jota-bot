import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export function Card({
  children,
  hoverable = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-neutral-200 p-6",
        hoverable && "hover:shadow-md hover:border-neutral-300 transition-all",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 border-b border-neutral-100 pb-4">{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-neutral-900">{children}</h3>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 pt-4 border-t border-neutral-100">
      {children}
    </div>
  );
}
