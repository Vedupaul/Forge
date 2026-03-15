import { cn } from "@/lib/utils";

export function PreviewIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-md border bg-background/70 text-[11px] font-semibold text-muted-foreground",
        className,
      )}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
