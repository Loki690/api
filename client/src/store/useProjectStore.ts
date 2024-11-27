import { IProjectProps, IProjectStoreProps } from '@/interfaces/IProject';
import { create } from 'zustand';

export const useProjectStore = create<IProjectStoreProps>((set) => ({
  projects: [],
  getProjects: async () => {
    const res = await fetch(`/api/project/projects`);
    const data = await res.json();
    if (res.ok) {
      set({ projects: data });
      return data;
    }
  },
  getProjectsById: async (projectId: string) => {
    const res = await fetch(`/api/project/project/${projectId}`);
    const data = await res.json();
    if (res.ok) {
      set({ projects: data });
      return data;
    }
  },
  addProject: (newProject: IProjectProps) =>
    set((state: any) => ({
      projects: [...state.projects, newProject],
    })),
  updateProject: (updatedProject: IProjectProps) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project._id === updatedProject._id ? updatedProject : project
      ),
    })),
  deleteProjects: (projectId: string) =>
    set((state) => ({
      projects: state.projects.filter(
        (project: IProjectProps) => project._id !== projectId
      ),
    })),
}));
