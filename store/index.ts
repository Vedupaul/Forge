import { create } from "zustand";
import type { BuilderProject, BuilderFile } from "@/types/project";

interface EditorState {
  project: BuilderProject | null;
  files: BuilderFile[];
  selectedFile: BuilderFile | null;
  isGenerating: boolean;
  isSaving: boolean;
  error: string | null;

  setProject: (project: BuilderProject) => void;
  setFiles: (files: BuilderFile[]) => void;
  setSelectedFile: (file: BuilderFile | null) => void;
  updateFile: (path: string, content: string) => void;
  addFile: (file: BuilderFile) => void;
  deleteFile: (path: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
}

export const useEditor = create<EditorState>((set) => ({
  project: null,
  files: [],
  selectedFile: null,
  isGenerating: false,
  isSaving: false,
  error: null,

  setProject: (project) => set({ project }),
  setFiles: (files) => set({ files }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  updateFile: (path, content) =>
    set((state) => ({
      files: state.files.map((f) => (f.path === path ? { ...f, content } : f)),
      selectedFile:
        state.selectedFile?.path === path
          ? { ...state.selectedFile, content }
          : state.selectedFile,
    })),
  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
    })),
  deleteFile: (path) =>
    set((state) => ({
      files: state.files.filter((f) => f.path !== path),
      selectedFile: state.selectedFile?.path === path ? null : state.selectedFile,
    })),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setError: (error) => set({ error }),
}));

interface DashboardState {
  projects: BuilderProject[];
  searchQuery: string;
  selectedSortBy: "updated" | "name" | "created";
  isLoadingProjects: boolean;

  setProjects: (projects: BuilderProject[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSortBy: (sort: "updated" | "name" | "created") => void;
  setIsLoadingProjects: (loading: boolean) => void;
  addProject: (project: BuilderProject) => void;
  updateProject: (project: BuilderProject) => void;
  deleteProject: (id: string) => void;
}

export const useDashboard = create<DashboardState>((set) => ({
  projects: [],
  searchQuery: "",
  selectedSortBy: "updated",
  isLoadingProjects: false,

  setProjects: (projects) => set({ projects }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedSortBy: (sort) => set({ selectedSortBy: sort }),
  setIsLoadingProjects: (loading) => set({ isLoadingProjects: loading }),
  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),
  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),
}));

interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  darkMode: boolean;

  setSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setDarkMode: (dark: boolean) => void;
  toggleSidebar: () => void;
  toggleCommandPalette: () => void;
  toggleDarkMode: () => void;
}

export const useUI = create<UIState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  darkMode: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setDarkMode: (dark) => set({ darkMode: dark }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
