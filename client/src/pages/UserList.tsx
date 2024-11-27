import UserDataTable from '@/components/user/UserDataTable';

export default function UserList() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <UserDataTable />
    </div>
  );
}
