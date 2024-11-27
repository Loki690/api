import ItemAdminDataTable from '@/components/items/ItemAdminDataTable';

export default function ItemAdminList() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Item List - Admin</h1>
      <ItemAdminDataTable />
    </div>
  );
}
