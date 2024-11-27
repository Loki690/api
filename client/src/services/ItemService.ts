import { IItemProps } from "@/interfaces/IItem";
import { useMutation } from "@tanstack/react-query";

export const addItems = (projectId: string) => {
  return useMutation({
    mutationFn: async (itemData: IItemProps) => {
      const res = await fetch(`/api/item/project/${projectId}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });
      if (!res.ok) {
        throw new Error("Failed to create item");
      }
      return res.json();
    },
  });
};

export const deleteItem = (projectId: string) => {
  return useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch(
        `/api/item/project/${projectId}/delete/${itemId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete the item");
      }
      return itemId;
    },
  });
};

export const updateItem = (projectId: string) => {
  return useMutation({
    mutationFn: async ({
      itemId,
      itemData,
    }: {
      itemId: string;
      itemData: IItemProps;
    }) => {
      const res = await fetch(
        `/api/item/project/${projectId}/update/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update the item");
      }
      return res.json();
    },
  });
};

//the state is not iterable
