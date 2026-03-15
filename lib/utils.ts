type ClassValue = string | number | false | null | undefined | ClassValue[] | Record<string, boolean>;

export function cn(...inputs: ClassValue[]) {
  return inputs
    .flatMap((input): string[] => {
      if (!input) return [];
      if (typeof input === "string" || typeof input === "number") return [String(input)];
      if (Array.isArray(input)) return [cn(...input)];
      return Object.entries(input)
        .filter(([, value]) => value)
        .map(([key]) => key);
    })
    .filter(Boolean)
    .join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatDateTime(value: Date | string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function titleFromPrompt(prompt: string) {
  const cleaned = prompt.replace(/^(build|create|make|generate)\s+/i, "").trim();
  if (!cleaned) return "Untitled project";
  return cleaned
    .split(/\s+/)
    .slice(0, 7)
    .join(" ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function formatDistanceToNow(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return Math.floor(seconds) + "s";
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function bytesToSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

export function getLanguageFromExtension(ext: string): string {
  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    rb: "ruby",
    go: "go",
    rs: "rust",
    java: "java",
    cs: "csharp",
    cpp: "cpp",
    c: "c",
    html: "html",
    css: "css",
    scss: "scss",
    less: "less",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    xml: "xml",
    sql: "sql",
    sh: "shell",
    bash: "bash",
    md: "markdown",
    txt: "plaintext",
  };
  return languageMap[ext.toLowerCase()] || "plaintext";
}
