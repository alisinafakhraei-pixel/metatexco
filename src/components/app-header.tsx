import { cn } from "cn";

export function AppHeader({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-background px-4 pt-[calc(env(safe-area-inset-top)+0.875rem)] pb-3",
        className
      )}
    >
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
      {children}
    </header>
  );
}
