import { IDepartments } from "@/interfaces/IDepartment";
import { useMutation } from "@tanstack/react-query";

export const addDepartment = (projectId: string) => {
  return useMutation({
    mutationFn: async (departmentList: IDepartments) => {
      const res = await fetch(`/api/department/addDepartments/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(departmentList),
      });
      if (!res.ok) {
        throw new Error("Failed to add department");
      }
      return res.json();
    },
  });
};

export const updateDepartment = (projectId: string) => {
  return useMutation({
    mutationFn: async ({
      departmentId,
      departmentData,
    }: {
      departmentId: string;
      departmentData: IDepartments;
    }) => {
      const res = await fetch(
        `/api/department/putDepartments/${projectId}/${departmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(departmentData),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update department");
      }
      return res.json();
    },
  });
};

export const deleteDepartments = (projectId: string) => {
  return useMutation({
    mutationFn: async (departmentId: string) => {
      const res = await fetch(
        `/api/department/deleteDepartments/${projectId}/${departmentId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete issued item");
      }
      return departmentId;
    },
  });
};
