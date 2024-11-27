import { useState } from 'react';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import IssuanceAddForm from './IssuanceAddForm';

export default function IssuingAdd() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <Button
        size="sm"
        className="ml-2 h-9 gap-1"
        onClick={() => setIsModalOpen(true)}
      >
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add SIL
        </span>
      </Button>
      <IssuanceAddForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
