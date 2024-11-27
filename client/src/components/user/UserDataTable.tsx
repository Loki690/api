import { useState } from 'react';
import { DataTable } from '../DataTable';

import { userColumns } from './UserColumns';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/store/useUserStore';
import UserAdd from './UserAdd';
import { DataTableSkeleton } from '../DataTableSkeleton';
import { IUserProps } from '@/interfaces/IAuth';
import { Input } from '../ui/Input';

export default function UserDataTable() {
  const { getUsers } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: users = [], isPending } = useQuery({
    queryKey: ['getUsers'],
    queryFn: () => getUsers(),
  });
  const filteredUsers = users?.filter(
    (getUser: IUserProps) =>
      getUser.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUser.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // const { selectedUser, setSelectedUser } = useUserUIStore();

  return (
    <>
      {isPending ? (
        <DataTableSkeleton columnCount={10} rowCount={10} shrinkZero />
      ) : (
        <div>
          {' '}
          <div className="flex justify-between mb-2">
            <Input
              placeholder="Search User"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-sm"
            />
            <UserAdd />
          </div>
          <DataTable columns={userColumns} data={filteredUsers || []} />
        </div>
      )}
    </>
  );
}
