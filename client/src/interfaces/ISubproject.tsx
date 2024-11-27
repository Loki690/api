export interface ISubprojects {
  _id?: string | any;
  subprojectName: string;
  subprojectDescription: string;
}

export interface ISubprojectsList {
  subprojects: ISubprojects[];
  getSubprojects: (projectId: string | undefined) => void;
  addSubprojects: (formData: ISubprojects, projectId: string) => void;
  putSubprojects: (formData: ISubprojects, subprojectId: string) => void;
}
