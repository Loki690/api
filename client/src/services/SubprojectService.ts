import { ISubprojects } from "@/interfaces/ISubproject";
import { useMutation } from "@tanstack/react-query";

export const addSubproject = (projectId: string) => {
  return useMutation({
    mutationFn: async (subprojectList: ISubprojects) => {
      const res = await fetch(`/api/subproject/addSubprojects/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subprojectList),
      });
      if (!res.ok) {
        throw new Error("Failed to add subproject");
      }
      return res.json();
    },
  });
};

export const updateSubproject = (projectId: string) => {
  return useMutation({
    mutationFn: async ({
      subprojectId,
      subprojectData,
    }: {
      subprojectId: string;
      subprojectData: ISubprojects;
    }) => {
      const res = await fetch(
        `/api/subproject/putSubprojects/${projectId}/${subprojectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subprojectData),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update department");
      }
      return res.json();
    },
  });
};

export const deleteSubprojects = (projectId: string) => {
  return useMutation({
    mutationFn: async (subprojectId: string) => {
      const res = await fetch(
        `/api/subproject/deleteSubprojects/${projectId}/${subprojectId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update department");
      }
      return res.json();
    },
  });
};
