import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative flex size-9 shrink-0 overflow-hidden rounded-md", className)} {...props} />;
}

export function AvatarImage({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) return null;
  return <Image src={src} alt={alt} fill sizes="36px" className="object-cover" />;
}

export function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex size-full items-center justify-center rounded-md bg-secondary text-xs font-semibold", className)}
      {...props}
    />
  );
}
