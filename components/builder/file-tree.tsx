"use client";

import { useState } from "react";
import { ChevronRight, File, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BuilderFile } from "@/types/project";

interface FileTreeProps {
  files: BuilderFile[];
  selectedFile?: BuilderFile | null;
  onSelectFile: (file: BuilderFile) => void;
  onDeleteFile?: (path: string) => void;
}

export function FileTree({
  files,
  selectedFile,
  onSelectFile,
  onDeleteFile,
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set([""]) // Root is always expanded
  );

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  };

  // Group files by directory
  const fileTree = buildFileTree(files);

  return (
    <div className="flex-1 overflow-auto p-2">
      <FileTreeNode
        node={fileTree}
        level={0}
        expanded={expandedFolders}
        onToggleFolder={toggleFolder}
        selectedFile={selectedFile}
        onSelectFile={onSelectFile}
        onDeleteFile={onDeleteFile}
      />
    </div>
  );
}

interface FileTreeNode {
  name: string;
  path: string;
  children?: Record<string, FileTreeNode>;
  file?: BuilderFile;
}

function buildFileTree(files: BuilderFile[]): FileTreeNode {
  const root: FileTreeNode = { name: "", path: "", children: {} };

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      if (!current.children) current.children = {};

      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          path: parts.slice(0, i + 1).join("/"),
        };
      }

      if (isFile) {
        current.children[part].file = file;
      }

      current = current.children[part];
    }
  }

  return root;
}

interface FileTreeNodeProps {
  node: FileTreeNode;
  level: number;
  expanded: Set<string>;
  onToggleFolder: (path: string) => void;
  selectedFile?: BuilderFile | null;
  onSelectFile: (file: BuilderFile) => void;
  onDeleteFile?: (path: string) => void;
}

function FileTreeNode({
  node,
  level,
  expanded,
  onToggleFolder,
  selectedFile,
  onSelectFile,
  onDeleteFile,
}: FileTreeNodeProps) {
  const isExpanded = expanded.has(node.path);
  const hasChildren = node.children && Object.keys(node.children).length > 0;
  const isFile = !!node.file;
  const isSelected = selectedFile?.path === node.file?.path;

  if (!node.name) {
    // Root node
    return (
      <div>
        {node.children &&
          Object.values(node.children).map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              level={0}
              expanded={expanded}
              onToggleFolder={onToggleFolder}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              onDeleteFile={onDeleteFile}
            />
          ))}
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded text-sm cursor-pointer transition-colors",
          isSelected &&
            "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (isFile && node.file) {
            onSelectFile(node.file);
          } else if (hasChildren) {
            onToggleFolder(node.path);
          }
        }}
      >
        {hasChildren && (
          <ChevronRight
            className={cn(
              "w-4 h-4 flex-shrink-0 transition-transform",
              isExpanded && "rotate-90"
            )}
          />
        )}
        {!hasChildren && isFile && <div className="w-4 h-4 flex-shrink-0" />}

        {isFile ? (
          <File className="w-4 h-4 flex-shrink-0 text-blue-400" />
        ) : (
          <Folder className="w-4 h-4 flex-shrink-0 text-amber-400" />
        )}

        <span className="truncate">{node.name}</span>
      </div>

      {isExpanded &&
        hasChildren &&
        node.children &&
        Object.values(node.children).map((child) => (
          <FileTreeNode
            key={child.path}
            node={child}
            level={level + 1}
            expanded={expanded}
            onToggleFolder={onToggleFolder}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
            onDeleteFile={onDeleteFile}
          />
        ))}
    </div>
  );
}
