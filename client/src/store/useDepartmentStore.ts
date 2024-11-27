import { IDepartments, IDepartmentsList } from "@/interfaces/IDepartment";
import { create } from "zustand";

export const useDepartments = create<IDepartmentsList>((set) => ({
  departments: [],
  getDepartments: async (projectId) => {
    const res = await fetch(
      `/api/department/getDepartments/project/${projectId}`
    );
    const data = await res.json();
    if (res.ok) {
      set({ departments: data });
      return data;
    }
  },
  addDepartments: (addDepartment: IDepartments, projectId: string) =>
    set((state: any) => ({
      departments: [...state.departments, addDepartment, projectId],
    })),
  putDepartments: (putDepartment: IDepartments) =>
    set((state) => ({
      departments: state.departments.map((department) =>
        department._id === putDepartment._id ? putDepartment : department
      ),
    })),
}));

//api/department/addDepartments/:projectId

//api/department/putDepartments/:projectId/:departmentId

//api/deleteDepartments/:projectId/:departmentId
