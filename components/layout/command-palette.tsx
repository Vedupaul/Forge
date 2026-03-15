"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const commands = [
  { label: "Dashboard", href: "/dashboard", icon: "D" },
  { label: "New AI project", href: "/new", icon: "A" },
  { label: "Templates", href: "/templates", icon: "T" },
  { label: "GitHub sync", href: "/settings?panel=github", icon: "G" },
  { label: "Settings", href: "/settings", icon: "S" },
];

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) return null;

  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/60 px-4 pt-24 backdrop-blur-sm">
      <button className="absolute inset-0 cursor-default" aria-label="Close command palette" onClick={() => setOpen(false)} />
      <div className="glass-panel relative w-full max-w-xl overflow-hidden rounded-lg">
        <div className="flex items-center gap-2 border-b px-4">
          <span className="text-sm text-muted-foreground" aria-hidden="true">/</span>
          <input
            autoFocus
            placeholder="Search projects, templates, actions..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Navigate</div>
          {filteredCommands.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">No results found.</div>
          ) : (
            filteredCommands.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push(item.href);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm outline-none hover:bg-secondary",
                )}
              >
                <span className="flex size-6 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-muted-foreground">
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
