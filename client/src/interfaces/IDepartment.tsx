export interface IDepartments {
  _id?: string | any;
  departmentName: string;
  departmentDescription: string;
}

export interface IDepartmentsList {
  departments: IDepartments[];
  getDepartments: (projectId: string | undefined) => void;
  addDepartments: (formData: IDepartments, projectId: string) => void;
  putDepartments: (formData: IDepartments, departmentId: string) => void;
}
