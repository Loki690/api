/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IssuedItemsPut,
  IStockIssuanceListProps,
  StockIssuance,
} from "@/interfaces/IIssuing";
import { create } from "zustand";

export const useIssuanceList = create<IStockIssuanceListProps>((set) => ({
  issuedItem: [],
  issuedItemInSIL: [],
  getIssuanceNo: async (projectId) => {
    const res = await fetch(
      `/api/issuance/project/${projectId}/getLastIssuance`
    );
    const data = await res.json();
    if (res.ok) {
      set({ issuedItem: data });
      return data;
    }
  },
  getIssuedItem: async (projectId) => {
    const res = await fetch(
      `/api/issuance/project/${projectId}/getAllIssuance`
    );
    const data = await res.json();
    if (res.ok) {
      set({ issuedItem: data });
      return data;
    }
  },
  getIssuedItemSelection: async (projectId) => {
    const res = await fetch(
      `/api/issuance/project/${projectId}/getAllIssuanceSelection`
    );
    const data = await res.json();
    if (res.ok) {
      set({ issuedItem: data });
      return data;
    }
  },
  getIssuedItemById: async (projectId, issuedId) => {
    const res = await fetch(
      `/api/issuance/project/${projectId}/getIssuanceById/${issuedId}`
    );
    const data = await res.json();
    if (res.ok) {
      set({ issuedItem: data });
      return data;
    }
  },

  addIssuedItem: (addIssuedItem: StockIssuance, projectId: string) =>
    set((state: any) => ({
      issuedItem: [...state.issuedItem, addIssuedItem, projectId],
    })),
  putIssuedItem: (putIssuedItem: IssuedItemsPut, issuedId: string) =>
    set((state: any) => ({
      issuedItem: [...state.issuedItem, putIssuedItem, issuedId],
    })),

  updateIssuedItems: (updatedIssuedItem, issuedItemId) =>
    set((state) => {
      // Ensure issuedItem is always treated as an array
      const issuedItemsArray = Array.isArray(state.issuedItem)
        ? state.issuedItem
        : [state.issuedItem];

      return {
        issuedItem: issuedItemsArray.map((issuedItem) =>
          issuedItem._id === issuedItemId
            ? { ...issuedItem, ...updatedIssuedItem } // Merge existing item with updated data
            : issuedItem
        ),
      };
    }),

  deleteIssuanceItem: (issuanceItemId: string) =>
    set((state) => ({
      issuedItem: state.issuedItem.filter(
        (issuedItems: StockIssuance) => issuedItems._id !== issuanceItemId
      ),
    })),
  deleteItemStockIssuance: (itemId: string, issuanceId: string) =>
    set((state) => ({
      issuedItemInSIL: state.issuedItemInSIL.filter(
        (itemsInSIL: IssuedItemsPut) =>
          itemsInSIL._id.toString() !== itemId ||
          itemsInSIL.issuanceId !== issuanceId // Ensure to check both itemId and issuanceId
      ),
    })),
}));
