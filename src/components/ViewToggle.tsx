import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BsGrid3X3 } from "react-icons/bs";
import { CiViewList } from "react-icons/ci";

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <Tabs value={viewMode} onValueChange={onViewModeChange} className="w-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="grid" className="flex items-center gap-2">
          <BsGrid3X3 className="h-4 w-4" />
          Grid
        </TabsTrigger>
        <TabsTrigger value="list" className="flex items-center gap-2">
          <CiViewList className="h-4 w-4" />
          List
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};