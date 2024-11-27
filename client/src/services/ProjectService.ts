import { IProjectProps } from "@/interfaces/IProject";
import { useMutation } from "@tanstack/react-query";

export const addProjects = () => {
  return useMutation({
    mutationFn: async (projectData: IProjectProps) => {
      const res = await fetch(`/api/project/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });
      if (!res.ok) {
        throw new Error("Failed to create project");
      }
      return res.json();
    },
  });
};

export const updateProjects = () => {
  return useMutation({
    mutationFn: async ({
      projectData,
      projectId,
    }: {
      projectData: IProjectProps;
      projectId: string;
    }) => {
      const res = await fetch(`/api/project/update/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });
      if (!res.ok) {
        throw new Error("Failed to update project");
      }
      return res.json();
    },
  });
};

export const deleteProjects = () => {
  return useMutation({
    mutationFn: async (projectId: string) => {
      const res = await fetch(`/api/project/delete/${projectId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete the item");
      }
    },
  });
};
