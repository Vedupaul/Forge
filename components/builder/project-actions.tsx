"use client";

import { Heart, Share2, Copy, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProjectActionsProps {
  projectId: string;
  projectName: string;
  projectUrl?: string;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

export function ProjectActions({
  projectId,
  projectName,
  projectUrl,
  isFavorited = false,
  onToggleFavorite,
}: ProjectActionsProps) {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/share/${projectId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/export`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Project exported!");
    } catch (error) {
      toast.error("Export failed");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleFavorite}
        className={isFavorited ? "text-red-500" : ""}
      >
        <Heart className="w-4 h-4" fill={isFavorited ? "currentColor" : "none"} />
      </Button>

      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>

      <Button variant="outline" size="sm" onClick={handleExport}>
        <Copy className="w-4 h-4 mr-2" />
        Export
      </Button>

      <Button variant="outline" size="sm">
        <Github className="w-4 h-4 mr-2" />
        Push
      </Button>
    </div>
  );
}
