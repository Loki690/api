import StockIssuanceComponent from '@/components/issuing/IssuingComponent';

export default function Issuing() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Stock Issuance List</h1>
      <StockIssuanceComponent />
    </div>
  );
}
