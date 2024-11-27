/* eslint-disable react-hooks/rules-of-hooks */
import { IssuedItemsPut, StockIssuance } from '@/interfaces/IIssuing';
import { useMutation } from '@tanstack/react-query';

export const addIssuedList = (projectId: string) => {
  return useMutation({
    mutationFn: async (issuedList: StockIssuance) => {
      const res = await fetch(`/api/issuance/project/${projectId}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issuedList),
      });
      if (!res.ok) {
        throw new Error('Failed to issued item');
      }
      return res.json();
    },
  });
};

export const putIssuedItems = (projectId: string) => {
  return useMutation({
    mutationFn: async ({
      issuedItemId,
      issuedItemData,
    }: {
      issuedItemId: string;
      issuedItemData: IssuedItemsPut[] | any;
    }) => {
      const res = await fetch(
        `/api/issuance/project/${projectId}/addItems/${issuedItemId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(issuedItemData),
        }
      );
      if (!res.ok) {
        throw new Error('Failed to issued the item');
      }
      return res.json();
    },
  });
};

export const updateIssuedItem = (projectId: string) => {
  return useMutation({
    mutationFn: async ({
      issuedItemId,
      issuedItemData,
    }: {
      issuedItemId: string;
      issuedItemData: StockIssuance;
    }) => {
      const res = await fetch(
        `/api/issuance/project/${projectId}/update/${issuedItemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(issuedItemData),
        }
      );
      if (!res.ok) {
        throw new Error('Failed to update issued list');
      }
      return res.json();
    },
  });
};

export const deleteIssuedItems = (projectId: string) => {
  return useMutation({
    mutationFn: async (issuedItemId: string) => {
      const res = await fetch(
        `/api/issuance/project/${projectId}/deleteIssuance/${issuedItemId}`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) {
        throw new Error('Failed to delete issued item');
      }
      return issuedItemId;
    },
  });
};

export const deleteItemIssued = (projectId: string) => {
  return useMutation({
    mutationFn: async ({
      itemId,
      issuanceId,
    }: {
      itemId: string;
      issuanceId: string;
    }) => {
      const res = await fetch(
        `/api/issuance/project/${projectId}/issuance/${issuanceId}/items/${itemId}`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) {
        throw new Error('Failed to delete issued item');
      }
      return itemId;
    },
  });
};
