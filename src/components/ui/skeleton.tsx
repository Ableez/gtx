import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-black/10 dark:bg-neutral-50/10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
