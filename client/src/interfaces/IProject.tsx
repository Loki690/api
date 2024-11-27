export interface IProjectProps {
  _id?: string;
  name: string;
  description: string;
  status?: string;
}

export interface IProjectStoreProps {
  projects: IProjectProps[];
  getProjects: () => void;
  getProjectsById: (projectId: string) => void;
  addProject: (formData: IProjectProps) => void;
  updateProject: (updatedProject: IProjectProps, projectId: string) => void;
}
