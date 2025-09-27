import React from 'react';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { Star, Info, Play } from 'lucide-react';

interface AppContextMenuProps {
  children: React.ReactNode;
  app: any;
  onAddToFavorites: (app: any) => void;
  onShowDetails: (app: any) => void;
  onLaunch?: (app: any) => void;
}

export const AppContextMenu: React.FC<AppContextMenuProps> = ({
  children,
  app,
  onAddToFavorites,
  onShowDetails,
  onLaunch,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {onLaunch && (
          <ContextMenuItem onClick={() => onLaunch(app)}>
            <Play className="mr-2 h-4 w-4" />
            <span>Launch</span>
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => onAddToFavorites(app)}>
          <Star className="mr-2 h-4 w-4" />
          <span>Add to favorites</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onShowDetails(app)}>
          <Info className="mr-2 h-4 w-4" />
          <span>Show details</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};