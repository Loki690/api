/* eslint-disable react-hooks/rules-of-hooks */
import { IReceivingProps } from '@/interfaces/IReceiving';
import { useMutation } from '@tanstack/react-query';

export const addReceivedItems = (projectId: string) => {
  return useMutation({
    mutationFn: async (receivedItem: IReceivingProps) => {
      const res = await fetch(`/api/receive/project/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receivedItem),
      });
      if (!res.ok) {
        throw new Error('Failed to received item');
      }
      return res.json();
    },
  });
};

export const updateReceivedItem = (projectId: string) => {
  return useMutation({
    mutationFn: async ({
      receivedItemId,
      receivedItemData,
    }: {
      receivedItemId: string;
      receivedItemData: IReceivingProps;
    }) => {
      const res = await fetch(
        `/api/receive/project/${projectId}/${receivedItemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(receivedItemData),
        }
      );
      if (!res.ok) {
        throw new Error('Failed to update the item');
      }
      return res.json();
    },
  });
};

export const deleteReceivedItem = (projectId: string) => {
  return useMutation({
    mutationFn: async (receivedItemId: string) => {
      const res = await fetch(
        `/api/receive/project/${projectId}/deleteReceivedItem/${receivedItemId}`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) {
        throw new Error('Failed to delete item');
      }
      return receivedItemId;
    },
  });
};
