/* eslint-disable @typescript-eslint/no-explicit-any */
import { IItemProps } from './IItem';
import { ReceivedItem } from '@/types/ReceivedItemTypes';
import { Items } from '@/types/ItemTypes';
import { StockIssuance, User } from './IIssuing';
import { IDepartments } from './IDepartment';
import { ISubprojects } from './ISubproject';
import { IProjectProps } from './IProject';

export interface IReceivingProps {
  _id?: string | any;
  itemCode?: string;
  itemDescription?: string;
  unit?: string;
  requistioner: User | any;
  receivedBy: User | any;
  dateReceived: Date;
  qtyIn?: number;
  items?: IItemProps | any;
  workOrderNo?: string;
  remarks?: string;
}

export interface IReceivingListStoreProps {
  receivedItem: IReceivingProps[];
  getReceivedItem: (projectId: string | undefined) => void;
  getReceivedItemSelection: (projectId: string | undefined) => void;
  addReceivedItem: (formData: IReceivingProps, projectId: string) => void;
  updateReceivedItems: (
    updateReceived: IReceivingProps,
    receivedItemId: string
  ) => void;
}

export interface UpdateReceivingItemProps {
  users: User | any;
  receiving?: ReceivedItem | any;
  items: Items | any;
  issuing?: StockIssuance | any;
  departments?: IDepartments | any;
  subprojects?: ISubprojects | any;
  projects?: IProjectProps | any;
  issuanceNo?: any;
  crewUsers?: User | any;
  inventoryUsers?: any;
  headUsers?: any;
}
