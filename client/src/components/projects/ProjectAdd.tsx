import { useState } from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import ProjectAddForm from "./ProjectAddForm";

export default function ProjectAdd() {
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
          Add Project
        </span>
      </Button>
      <ProjectAddForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
