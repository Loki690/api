// useTabStore.ts
import { create } from "zustand";
import { StockIssuance } from "@/interfaces/IIssuing";
import { IReceivingProps } from "@/interfaces/IReceiving";

interface TabStore {
  activeTab: string;
  selectedItem: StockIssuance | null;

  setActiveTab: (tab: string) => void;
  setSelectedItem: (item: StockIssuance) => void;
}

interface ReceivedTabStore {
  activeTab: string;
  selectedReceive: IReceivingProps | null;
  setActiveTab: (tab: string) => void;
  setSelectedReceived: (item: IReceivingProps) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  activeTab: "issuingTable",
  selectedItem: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedItem: (item) => set({ selectedItem: item }),
}));

export const useReceivingTabStore = create<ReceivedTabStore>((set) => ({
  activeTab: "receivingTable",
  selectedReceive: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedReceived: (item) => set({ selectedReceive: item }),
}));
