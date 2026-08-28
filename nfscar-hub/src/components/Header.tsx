import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-6 mb-6">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-neutral-900 mb-1">{title}</h1>
        {description && (
          <p className="text-neutral-600 text-sm">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
