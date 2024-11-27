import { useState } from 'react';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import ItemAddForm from './ItemAddForm';

export default function ItemAdd() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <Button
        size="sm"
        className="ml-2 h-8 gap-1"
        onClick={() => setIsModalOpen(true)}
      >
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Item
        </span>
      </Button>
      <ItemAddForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
