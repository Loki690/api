import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ReceivingDataTable from "./ReceivingDataTable";
import ReceivingAddForm from "./ReceivingAddForm";
import ReceivingUpdateForm from "./ReceivingUpdateForm";
import { useUserStore } from "@/store/useUserStore";
import { useItemStore } from "@/store/userItemStore";
import { IUserProps } from "@/interfaces/IAuth";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IItemProps } from "@/interfaces/IItem";
import { useReceivedItem } from "@/store/useReceivedItem";
import { IReceivingProps } from "@/interfaces/IReceiving";

export default function ReceivingComponent() {
  const { projectId } = useParams() as { projectId: string };
  const { getUsersByProject } = useUserStore();
  const { getItem } = useItemStore();
  const { getReceivedItemSelection } = useReceivedItem();

  const { data: receiving = [] } = useQuery<IReceivingProps[] | any>({
    queryKey: ["getReceivedItemsSelection"],
    queryFn: () => getReceivedItemSelection(projectId),
  });
  const { data: users = [] } = useQuery<IUserProps[] | any>({
    queryKey: ["getUsers"],
    queryFn: () => getUsersByProject(projectId),
  });

  const { data: items = [] } = useQuery<IItemProps[] | any>({
    queryKey: ["getItems"],
    queryFn: () => getItem(projectId),
  });

  return (
    <div>
      <Tabs defaultValue="receivingTable">
        <TabsList>
          <TabsTrigger value="receivingTable">Receiving List</TabsTrigger>
          <TabsTrigger value="receivingForm">Receiving Form</TabsTrigger>
          <TabsTrigger value="receivingUpdate">Receiving Update</TabsTrigger>
        </TabsList>
        <TabsContent value="receivingTable">
          <ReceivingDataTable />
        </TabsContent>
        <TabsContent value="receivingForm">
          <ReceivingAddForm users={users} items={items} />
        </TabsContent>
        <TabsContent value="receivingUpdate">
          <ReceivingUpdateForm
            users={users}
            receiving={receiving}
            items={items}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
