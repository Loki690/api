import { toast } from "@/hooks/use-toast";
import { IItemListStoreProps, IItemProps } from "@/interfaces/IItem";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";

export const useItemStore = create<IItemListStoreProps>((set) => ({
  items: [],
  itemHistory: [],
  currentPage: 1,
  itemsPerPage: 10,
  searchTerm: "",
  totalPages: 0,

  setCurrentPage: (page: number) => set({ currentPage: page }),
  setItemsPerPage: (limit: number) => set({ itemsPerPage: limit }),
  setSearchTerm: (term: string) => set({ searchTerm: term }),

  getItemById: async (itemId: string) => {
    const res = await fetch(`/api/item/getItem/${itemId}`);
    const data = await res.json();
    if (res.ok) {
      set({ items: data });
      return data;
    }
  },

  getAllItems: async (projectId, searchTerm = "", page = 1, limit = 10) => {
    const res = await fetch(
      `/api/item/project/${projectId}/getItems?search=${encodeURIComponent(
        searchTerm
      )}&page=${page}&limit=${limit}`
    );
    const data = await res.json();
    if (res.ok) {
      set({
        items: data.items,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
      return data;
    } else {
      console.error("Error fetching items:", data.message);
      return { items: [], totalPages: 0, totalItems: 0 };
    }
  },

  getItem: async (projectId) => {
    const res = await fetch(`/api/item/project/${projectId}/getItemsSelection`);
    const data = await res.json();
    if (res.ok) {
      set({ items: data });
      return data;
    }
  },

  getItemProject: async (projectId, searchTerm = "", page = 1, limit = 10) => {
    const res = await fetch(
      `/api/item/project/${projectId}/getProjectItems?search=${encodeURIComponent(
        searchTerm
      )}&page=${page}&limit=${limit}`
    );
    const data = await res.json();
    if (res.ok) {
      set({ items: data, currentPage: data.currentPage });
      return res.ok ? data : [];
    }
  },

  setItems: (items: IItemProps[]) => set({ items }),
  addItem: (newItem: IItemProps, projectId: string) =>
    set((state: any) => ({
      items: [...state.items, newItem, projectId],
    })),

  deleteItem: (itemId: string) =>
    set((state: any) => ({
      items: state.items.filter((item: IItemProps) => item._id !== itemId),
    })),

  updateItems: (updatedItem: IItemProps) =>
    set((state) => ({
      items: Array.isArray(state.items)
        ? state.items.map((item) =>
            item._id === updatedItem._id ? updatedItem : item
          )
        : state.items, // Return the current value if `items` is not an array
    })),
  getItemHistory: async (itemId) => {
    const res = await fetch(`/api/history/get/item/${itemId}`);

    if (!res.ok) {
      toast({ title: "No history" });

      return [];
    }

    const data = await res.json();
    if (res.ok) {
      set({ itemHistory: data });
      return res.ok ? data : [];
    }
  },

  importExcel: async (file: File, projectId: string) => {
    set({ isUploading: true });
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/item/project/${projectId}/import`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload Excel file / check for duplicate");
      }

      const data = await res.json();
      set((state) => ({ items: [...state.items, ...data.savedItems] }));
      toast({ title: "Excel imported successfully!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to import Excel", description: `${error}` });
    } finally {
      set({ isUploading: false });
    }
  },
}));

export const useItems = (projectId: string) => {
  const getItem = useItemStore((state) => state.getItem);
  return useQuery({
    queryKey: ["getItems"],
    queryFn: () => getItem(projectId),
    // initialData: [], // Return an empty array by default
  });
};
