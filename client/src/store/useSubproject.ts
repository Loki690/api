import { ISubprojects, ISubprojectsList } from "@/interfaces/ISubproject";
import { create } from "zustand";

export const useSubprojects = create<ISubprojectsList>((set) => ({
  subprojects: [],
  getSubprojects: async (projectId) => {
    const res = await fetch(
      `/api/subproject/getSubprojects/project/${projectId}`
    );
    const data = await res.json();
    if (res.ok) {
      set({ subprojects: data });
      return data;
    }
  },
  addSubprojects: (addSubproject: ISubprojects, projectId: string) =>
    set((state: any) => ({
      subprojects: [...state.subprojects, addSubproject, projectId],
    })),
  putSubprojects: (putSubproject: ISubprojects) =>
    set((state) => ({
      subprojects: state.subprojects.map((subproject) =>
        subproject._id === putSubproject._id ? putSubproject : subproject
      ),
    })),
}));
