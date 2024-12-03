/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IItemProps {
  _id?: string | any;
  itemCode: string;
  itemDescription: string;
  unit: string;
  qtyIn: number;
  qtyOut: number;
  stockOnHand: number;
  toolLocator: string;
  remarks: string;
  project?: string | any;
  history?: ItemLogEntry;
  item?: ItemReceived[] | any;
}

export interface ItemReceived {
  item: string;
  qtyIn: number;
}

export interface ItemLogEntry {
  _id: string;
  action: 'created' | 'received' | 'issued';
  itemId?: {
    qtyIn: number;
    stockOnHand: number | string;
    qtyOut: number;
  };
  qtyReceived?: number;
  qtyIssue?: number;
  timestamp: string;
  changes?: string;
  stockIssuanceNo?: string;
  workOrderNo?: string;
  qtyOut?: number;
}

export interface IItemListStoreProps {
  items: IItemProps[];
  itemHistory: ItemLogEntry[];
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  totalPages: number;
  getAllItems: (projectId: string | undefined) => void;
  // getAllItems: (
  //   projectId: string | undefined,
  //   search: string,
  //   page: number,
  //   limit: number
  // ) => void;
  getItemById: (itemId: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  setSearchTerm: (term: string) => void;
  setItems: (items: IItemProps[] | any) => void;
  getItem: (projectId: string | undefined) => void;
  getItemProject: (
    projectId: string | undefined,
    search: string,
    page: number,
    limit: number
  ) => void;
  addItem: (formData: IItemProps, projectId: string) => void;
  updateItems: (updatedItem: IItemProps, itemId: string) => void;
  getItemHistory: (itemId: string) => void;
  isUploading?: boolean; // Optional: Tracks file upload status
  importExcel?: (file: File, projectId: string) => Promise<void>; // Optional: Handles Excel import
}

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}
