"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeploymentStatusProps {
  status: "queued" | "building" | "ready" | "error";
  url?: string;
  progress?: number;
}

export function DeploymentStatus({ status, url, progress = 0 }: DeploymentStatusProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (status === "ready") {
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!isVisible && status === "ready") return null;

  const statusConfig = {
    queued: {
      icon: Clock,
      label: "Queued",
      color: "text-slate-400",
      bg: "bg-slate-400/10",
      border: "border-slate-400/20",
    },
    building: {
      icon: Zap,
      label: "Building",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
    },
    ready: {
      icon: Check,
      label: "Ready",
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20",
    },
    error: {
      icon: AlertCircle,
      label: "Error",
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 rounded-lg border backdrop-blur-sm p-4 max-w-sm",
        config.bg,
        config.border
      )}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "w-5 h-5 flex-shrink-0",
            config.color,
            status === "building" && "animate-spin"
          )}
        />
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium", config.color)}>
            {config.label}
          </p>
          {url && status === "ready" && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline truncate block"
            >
              {url}
            </a>
          )}
          {status === "building" && progress > 0 && (
            <div className="mt-2 h-1 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-current transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
