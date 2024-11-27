/* eslint-disable @typescript-eslint/no-explicit-any */
export type ReceivedItem = {
  _id: string;
  itemCode: string;
  itemDescription: string;
  unit: string;
  requistioner: Requistioner | any;
  receivedBy: ReceivedBy | any;
  dateReceived: Date;
  qtyIn: number;
  project?: string | any;
  item: ReceivedItem;
  workOrderNo: string;
  remarks: string;
};

export type Requistioner = {
  firstName: string;
  lastName: string;
};

export type ReceivedBy = {
  firstName: string;
  lastName: string;
};

export type ReceivedItems = ReceivedItem[];
