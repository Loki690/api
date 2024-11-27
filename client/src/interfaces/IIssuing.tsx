import { IDepartments } from "./IDepartment";
import { ISubprojects } from "./ISubproject";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface StockIssuance {
  _id?: string | any;
  stockIssuanceNo?: string | any;
  dateIssued: Date | any;
  department: IDepartments | any;
  projects: ISubprojects | any;
  purpose: string;
  requisitioner: User | any;
  members: User[] | any;
  receivedBy: User | any;
  releasedBy: User | any;
  approvedBy: User | any;
  project?: string;
  items?: IssuedItem[] | any;
  remarks?: any;
  qtyOut?: any;
}

export interface User {
  firstName: string;
  lastName: string;
}

export interface IssuedItem {
  item: {
    _id: string;
    itemCode: string;
    itemDescription: string;
    unit: string;
    remarks: string;
  };
  qtyOut: number;
  _id: string;
}
export interface IssuedItems {
  _id: string;
  itemCode: string;
  itemDescription: string;
  qtyOut: number;
  unit: string;
  remarks: string;
}

export interface IssuedItemsPut {
  _id?: string | any;
  items: [
    {
      _id: string | any;
      item: string | any;
      qtyOut: number;
      remarks: string;
    }
  ];
  issuanceId: string;
}

export interface IssuanceResponse {
  data: StockIssuance[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface IStockIssuanceListProps {
  issuedItem: StockIssuance[];
  issuedItemInSIL: IssuedItemsPut[];
  getIssuanceNo: (projectId: string | undefined) => void;
  getIssuedItem: (projectId: string | undefined) => void;
  getIssuedItemSelection: (projectId: string | undefined) => void;
  getIssuedItemById: (projectId: string, issuedId: string) => void;
  addIssuedItem: (formData: StockIssuance, projectId: string) => void;
  putIssuedItem: (formData: IssuedItemsPut, issuedId: string) => void;
  updateIssuedItems: (
    updateIssued: StockIssuance,
    issuedItemId: string
  ) => void;
}
