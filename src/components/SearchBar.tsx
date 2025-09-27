import React from 'react';
import { Input } from '@/components/ui/input';
import { LuSearch } from "react-icons/lu";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search apps..." 
}) => {
  return (
    <div className="relative mb-8">
      <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 w-full"
        autoFocus
      />
    </div>
  );
};