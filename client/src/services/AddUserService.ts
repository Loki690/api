import { IUserListProps } from '@/interfaces/IUser';
import { useMutation } from '@tanstack/react-query';

export const useCreateUserWithProject = () => {
  return useMutation({
    mutationFn: async (userData: IUserListProps) => {
      const res = await fetch(`/api/user/createUserWithProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error('Failed to create user');
      }

      return res.json();
    },
  });
};

export const deleteUsers = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/user/delete/${userId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete the user');
      }
      return userId;
    },
  });
};

export const updateUser = () => {
  return useMutation({
    mutationFn: async ({
      userId,
      userData,
    }: {
      userId: string;
      userData: IUserListProps;
    }) => {
      const res = await fetch(`/api/user/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        throw new Error('Failed to update the user');
      }
      return res.json();
    },
  });
};
