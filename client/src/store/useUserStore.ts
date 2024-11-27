import { IUserProps } from '@/interfaces/IAuth';
import { IProjectProps } from '@/interfaces/IProject';
import { IUserListProps, IUserListStoreProps } from '@/interfaces/IUser';
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';

export const useUserStore = create<IUserListStoreProps>((set) => ({
  users: [],
  projects: [] as IProjectProps[],
  getUsers: async () => {
    const res = await fetch(`/api/user/allUsers`);
    const data = await res.json();
    if (res.ok) {
      set({ users: data });
      return res.ok ? data : [];
    }
  },
  getUsersByProject: async (projectId) => {
    const res = await fetch(`/api/user/projectUser/${projectId}/getAll`);
    const data = await res.json();
    if (res.ok) {
      set({ users: data });
      return data || [];
    }
  },
  addUsers: (newUser: IUserListProps) =>
    set((state) => ({
      users: [...state.users, newUser], // Add new user to state
    })),
  updateUsers: (updatedUser: IUserListProps) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      ),
    })),

  getProjects: async () => {
    const res = await fetch(`/api/project/projects`);
    const data: IProjectProps[] = await res.json();
    if (res.ok) {
      set({ projects: data });
      return data;
    }
  },
  deleteUser: (userId: string) =>
    set((state) => ({
      users: state.users.filter((user: IUserListProps) => user.id !== userId),
    })),

  setUser: (users: IUserProps[]) => set({ users }),
}));

export const useUsers = (projectId: string) => {
  const getUser = useUserStore((state) => state.getUsersByProject);
  return useQuery({
    queryKey: ['getUsers'],
    queryFn: () => getUser(projectId),
  });
};
