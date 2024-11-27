import {
  IReceivingListStoreProps,
  IReceivingProps,
} from "@/interfaces/IReceiving";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";

export const useReceivedItem = create<IReceivingListStoreProps>((set) => ({
  receivedItem: [],
  getReceivedItem: async (projectId) => {
    const res = await fetch(
      `/api/receive/project/allReceivedItem/${projectId}`
    );
    const data = await res.json();
    if (res.ok) {
      set({ receivedItem: data });
      return res.ok ? data : [];
    }
  },
  getReceivedItemSelection: async (projectId) => {
    const res = await fetch(
      `/api/receive/project/allReceivedItemSelection/${projectId}`
    );
    const data = await res.json();
    if (res.ok) {
      set({ receivedItem: data });
      return res.ok ? data : [];
    }
  },

  addReceivedItem: (addReceivedItem: IReceivingProps, projectId: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      receivedItem: [...state.receivedItem, addReceivedItem, projectId],
    })),

  updateReceivedItems: (updatedReceivedItem: IReceivingProps) =>
    set((state) => ({
      receivedItem: state.receivedItem.map((receivedItems) =>
        receivedItems._id === updatedReceivedItem._id
          ? updatedReceivedItem
          : receivedItems
      ),
    })),

  deleteReceivedItem: (receivedItemId: string) =>
    set((state) => ({
      receivedItem: state.receivedItem.filter(
        (receivedItems: IReceivingProps) => receivedItems._id !== receivedItemId
      ),
    })),
}));

export const useReceivedItems = (projectId: string) => {
  const getReceivedItem = useReceivedItem((state) => state.getReceivedItem);
  return useQuery({
    queryKey: ["getReceivedItems"],
    queryFn: () => getReceivedItem(projectId),
  });
};
