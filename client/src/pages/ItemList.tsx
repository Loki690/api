import ItemDataTable from '@/components/items/ItemDataTable';

export default function ItemList() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Item List</h1>
      <ItemDataTable />
    </div>
  );
}
