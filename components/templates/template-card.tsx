"use client";

import { motion } from "framer-motion";
import { Lock, Share2 } from "lucide-react";
import Link from "next/link";
import type { BuilderTemplate } from "@/types/project";

interface TemplateCardProps {
  template: BuilderTemplate;
  onSelect?: (template: BuilderTemplate) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm transition-colors hover:border-white/20"
    >
      <div className="space-y-4">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white/70 mb-3">
            {template.category}
          </div>
          <h3 className="text-lg font-semibold text-white">{template.name}</h3>
          <p className="mt-2 text-sm text-white/60">{template.description}</p>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-white/50 line-clamp-2 italic">"{template.prompt}"</p>
        </div>

        <button
          onClick={() => onSelect?.(template)}
          className="w-full px-4 py-2 rounded-md bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
        >
          Use template
        </button>
      </div>

      {template.featured && (
        <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-medium text-amber-200">
          Featured
        </div>
      )}
    </motion.div>
  );
}

interface TemplateGridProps {
  templates: BuilderTemplate[];
  onSelectTemplate?: (template: BuilderTemplate) => void;
}

export function TemplateGrid({ templates, onSelectTemplate }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} onSelect={onSelectTemplate} />
      ))}
    </div>
  );
}
