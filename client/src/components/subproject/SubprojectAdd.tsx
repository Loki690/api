import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import SubprojectAddForm from "./SubprojectAddForm";
import { useState } from "react";

export default function SubprojectAdd() {
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
          Add Projects
        </span>
      </Button>
      <SubprojectAddForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
