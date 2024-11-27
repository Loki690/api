import { ItemLogEntry } from "@/interfaces/IItem";
import { Row } from "@tanstack/react-table";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Items = {
  _id: string;
  itemCode: string;
  itemDescription: string;
  unit: string;
  qtyIn: number;
  qtyOut: number;
  stockOnHand: number;
  toolLocator: string;
  remarks: string;
  project: Project;
  history?: ItemLogEntry;
};

type Project = {
  _id?: string;
  name?: string;
};

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  type: "update" | "delete";
}
