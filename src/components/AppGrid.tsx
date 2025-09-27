import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { FaCog } from 'react-icons/fa';
import { AppContextMenu } from './AppContextMenu';
import type { AppItem } from '../types';

interface AppGridProps {
  apps: AppItem[];
  onLaunch: (app: AppItem) => void;
  viewMode: 'grid' | 'list';
  onEdit?: (app: AppItem) => void;
  onDelete?: (app: AppItem) => void;
}

export const AppGrid: React.FC<AppGridProps> = ({ apps, onLaunch, viewMode, onEdit, onDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {apps.map((app, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <AppContextMenu
                    app={app}
                    onAddToFavorites={() => {}}
                    onShowDetails={() => {}}
                    onLaunch={onLaunch}
                  >
                    <Card className="relative cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
                      {/* Gear icon dropdown */}
                      <div className="absolute top-2 right-2 z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={e => {e.stopPropagation(); setDropdownOpen(index);}}>
                              <FaCog />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={e => {e.stopPropagation(); if (onEdit) onEdit(app);}}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={e => {e.stopPropagation(); if (onDelete) onDelete(app);}}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardContent className="p-4 flex flex-col items-center text-center" onClick={() => onLaunch(app)}>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-2">
                          <span className="text-white font-bold text-lg">
                            {app.name.charAt(0)}
                          </span>
                        </div>
                        <h3 className="font-medium text-sm truncate w-full">
                          {app.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {app.category}
                        </p>
                      </CardContent>
                    </Card>
                  </AppContextMenu>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{app.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-3">
      {apps.map((app, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="relative cursor-pointer hover:shadow-md transition-all">
                {/* Gear icon dropdown */}
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={e => {e.stopPropagation(); setDropdownOpen(index);}}>
                        <FaCog />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={e => {e.stopPropagation(); if (onEdit) onEdit(app);}}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={e => {e.stopPropagation(); if (onDelete) onDelete(app);}}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardContent className="p-3 flex items-center" onClick={() => onLaunch(app)}>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold">
                      {app.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">{app.category}</p>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>{app.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};