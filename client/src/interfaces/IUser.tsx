import { IUserProps } from './IAuth';
import { IProjectProps } from './IProject';

export interface IUserListProps {
  id?: string;
  userCode: string;
  firstName: string;
  lastName: string;
  role: string;
  project?: string;
}

export interface IUserListStoreProps {
  users: IUserListProps[];
  projects: IProjectProps[];
  getUsers: () => void;
  getUsersByProject: (projectId: string) => void;
  addUsers: (formData: IUserListProps) => void;
  updateUsers: (formData: IUserListProps, userId: string) => void;
  getProjects: () => void;
  deleteUsers?: (userId: IUserListProps) => void;
  setUser: (users: IUserProps[] | any) => void;
  updateUserProject: (userId: string, newProject: string) => void;
}

export interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}
