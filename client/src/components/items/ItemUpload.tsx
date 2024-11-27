import { useItemStore } from '@/store/userItemStore';
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ItemUpload = ({ projectId }: { projectId: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const importExcel = useItemStore((state: any) => state.importExcel);
  const isUploading = useItemStore((state: any) => state.isUploading);

  // Get the query client from React Query
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast({ title: 'Please select a file first' });
      return;
    }

    // Call the importExcel function from your store
    importExcel?.(file, projectId)
      .then(() => {
        // After successful import, invalidate the 'getItems' query
        queryClient.invalidateQueries({ queryKey: ['getItems'] });
      })
      .catch((error: any) => {
        console.error('Failed to import items:', error);
      });
  };

  return (
    <div className="flex gap-2">
      <Input type="file" onChange={handleFileChange} className="w-full" />
      <Button type="submit" onClick={handleImport} disabled={isUploading}>
        {isUploading ? (
          <LoaderCircle className="size-5 animate-spin" />
        ) : (
          'Import Excel'
        )}
      </Button>
    </div>
  );
};

export default ItemUpload;
