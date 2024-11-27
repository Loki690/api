import { ReceivedBy, Requistioner } from './ReceivedItemTypes';

type Items = {
  item: string;
  qtyOut: number;
  itemCode: string;
  itemDescription: string;
  unit: string;
};

export type IssuanceList = {
  _id: string;
  stockIssuanceNo: string;
  dateIssued: string;
  department: string;
  projects: string;
  purpose: string;
  requistioner: Requistioner;
  members: string[];
  receivedBy: ReceivedBy;
  releasedBy: string;
  project: string;
  items: Items[];
};
