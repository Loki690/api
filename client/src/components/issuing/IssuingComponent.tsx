import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import IssuanceDataTable from './IssuanceDataTable';
import IssuingAddForm from './IssuingAddForm';
import { IUserProps } from '@/interfaces/IAuth';
import { IItemProps } from '@/interfaces/IItem';
import { useItemStore } from '@/store/userItemStore';
import { useUserStore } from '@/store/useUserStore';
import { useParams } from 'react-router-dom';
import { useIssuanceList } from '@/store/useIssuanceStore';
import IssuingUpdateForm from './IssuingUpdateForm';
import { useSubprojects } from '@/store/useSubproject';
import { useDepartments } from '@/store/useDepartmentStore';
//import { IDepartments } from "@/interfaces/IDepartment";
import { ISubprojects } from '@/interfaces/ISubproject';
import { useProjectStore } from '@/store/useProjectStore';

export default function StockIssuanceComponent() {
  const { projectId } = useParams() as { projectId: string };
  const { getUsersByProject } = useUserStore();
  const { getItem } = useItemStore();
  const { getIssuedItemSelection, getIssuanceNo } = useIssuanceList();
  const { getSubprojects } = useSubprojects();
  //const { getDepartments } = useDepartments();
  const { getProjectsById } = useProjectStore();
  const { data: projects = [] } = useQuery<any>({
    queryKey: ['getProjectsById'],
    queryFn: () => getProjectsById(projectId),
  });

  const { data: issuanceNo = [] } = useQuery({
    queryKey: ['getIssuanceNo'],
    queryFn: () => getIssuanceNo(projectId),
    enabled: !!projectId,
  });

  const { data: issued = [] } = useQuery({
    queryKey: ['getIssuedItemsSelection'],
    queryFn: () => getIssuedItemSelection(projectId),
  });
  const { data: users = [] } = useQuery<IUserProps[] | any>({
    queryKey: ['getUsers'],
    queryFn: () => getUsersByProject(projectId),
  });

  const { data: items = [] } = useQuery<IItemProps[] | any>({
    queryKey: ['getItems'],
    queryFn: () => getItem(projectId),
  });

  // const { data: department = [] } = useQuery<IDepartments[] | any>({
  //   queryKey: ["getDepartments"],
  //   queryFn: () => getDepartments(projectId),
  // });

  const { data: subproject = [] } = useQuery<ISubprojects[] | any>({
    queryKey: ['getSubprojects'],
    queryFn: () => getSubprojects(projectId),
  });

  return (
    <div className="container mx-auto ">
      <Tabs defaultValue="issuingTable">
        <TabsList>
          <TabsTrigger value="issuingTable">Issuance List</TabsTrigger>
          <TabsTrigger value="issuingAdd">Issuing Form</TabsTrigger>
          <TabsTrigger value="issuingUpdate">Issuing Update</TabsTrigger>
        </TabsList>
        <TabsContent value="issuingTable">
          <IssuanceDataTable />
        </TabsContent>
        <TabsContent value="issuingAdd">
          <IssuingAddForm
            users={users}
            items={items}
            //departments={department}
            subprojects={subproject}
            projects={projects}
            issuanceNo={issuanceNo}
          />
        </TabsContent>
        <TabsContent value="issuingUpdate">
          <IssuingUpdateForm
            users={users}
            issuing={issued}
            items={items}
            // departments={department}
            subprojects={subproject}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
