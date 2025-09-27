import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useAppData } from "./hooks/useAppData";
import "./styles/App.css";

import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

import { AddAppDialog } from "./components/AddAppDialog";
import { EditAppDialog } from "./components/EditAppDialog";
import { AppContextMenu } from "./components/AppContextMenu";
import { AppGrid } from "./components/AppGrid";
import { SearchBar } from "./components/SearchBar";
import { SettingsDialog } from "./components/SettingsDialog";
import { ViewToggle } from "./components/ViewToggle";
import { ToastProvider } from "./components/ToastProvider";
import { CategoryFilter } from "./components/CategoryFilter";
import { ThemeProvider } from "@/components/ThemeProvider";

import { RxUpdate } from "react-icons/rx";
import { PiGear } from "react-icons/pi";
import { FaPlus, FaMinus } from "react-icons/fa";

import type { AppItem } from "./types";

function App() {
  const { apps, categories, loading, error, refreshApps, searchApps } =
    useAppData();
  const [filteredApps, setFilteredApps] = useState<AppItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editApp, setEditApp] = useState<AppItem | null>(null);

  useEffect(() => {
    filterApps();
  }, [searchQuery, selectedCategory, apps]);

  const refreshAppList = async () => {
    // This function should call your Rust command `get_apps`
    // and also load the custom apps from the file, then combine them.
    // For now, let's assume `refreshApps` from `useAppData` does this.
    refreshApps();
  };

  const filterApps = async () => {
    if (searchQuery.trim()) {
      const results = await searchApps(searchQuery);
      setFilteredApps(
        selectedCategory === "all"
          ? results
          : results.filter((app) => app.category === selectedCategory)
      );
    } else {
      setFilteredApps(
        selectedCategory === "all"
          ? apps
          : apps.filter((app) => app.category === selectedCategory)
      );
    }
  };

  const launchApp = async (app: AppItem) => {
    try {
      await invoke("launch_app", { appPath: app.path });
      toast(`Launching ${app.name}...`);
    } catch (error) {
      console.error("Failed to launch app:", error);
      toast(`Failed to launch ${app.name}`);
    }
  };

  const handleEditApp = (app: AppItem) => {
    console.log("Edit app:", app);
    setEditApp(app);
    setIsEditDialogOpen(true);
  };

  const handleDeleteApp = async (app: AppItem) => {
    console.log("Delete app:", app);
    try {
      const result = await invoke("remove_custom_app", { appId: app.id });
      if (result === undefined || result === null) {
        toast.success(`Deleted ${app.name}`);
        refreshAppList();
      } else {
        toast.error(`Delete returned: ${result}`);
      }
    } catch (error) {
      console.error("Failed to delete app:", error);
      toast.error(`Failed to delete ${app.name}`);
    }
  };

  const handleAddToFavorites = (app: AppItem) => {
    toast(`Added ${app.name} to favorites`);
  };

  const handleShowDetails = (app: AppItem) => {
    showToast(`Showing details for ${app.name}`);
  };

  const showToast = (message: string) => {
    toast({
      title: message,
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <div>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <RxUpdate className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Loading applications...</p>
            </div>
          </div>
        </ThemeProvider>
      </div>
    );
  }

  if (error) {
    console.error(error);
    return (
      <div>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={refreshApps}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </ThemeProvider>
      </div>
    );
  }
  if (!loading && apps.length === 0) {
    return (
      <div>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-4">
                No applications found.
              </p>
              <div className="space-y-3">
                <button
                  onClick={refreshApps}
                  className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Scan Again
                </button>
                {/* Add the option to add an app directly from the empty state */}
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="block w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Your First Application
                </button>
              </div>
            </div>
          </div>
          <div>
            <AddAppDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onAppAdded={refreshAppList}
            />
          </div>
        </ThemeProvider>
      </div>
    );
  }

  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ToastProvider>
          <div className="min-h-screen bg-gradient-to-br  p-4">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    App Launcher
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <ViewToggle
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />

                  <button
                    onClick={refreshApps}
                    className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Refresh apps"
                  >
                    <RxUpdate />
                  </button>

                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Settings"
                  >
                    <PiGear />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4 mb-1">
                <div className="flex-1">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search applications..."
                  />
                </div>
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
              <p className="text-gray-400 w-full text-right mb-4">
                {apps.length} applications available
              </p>

              {/* App Grid/List */}
              <AppContextMenu
                app={apps}
                onAddToFavorites={handleAddToFavorites}
                onShowDetails={handleShowDetails}
                onLaunch={launchApp}
              >
                <AppGrid
                  apps={filteredApps}
                  onLaunch={launchApp}
                  viewMode={viewMode}
                  onEdit={handleEditApp}
                  onDelete={handleDeleteApp}
                />
              </AppContextMenu>
              <div className="grid grid-cols-2 min-w-full w-50 gap-4 mt-4 align-right">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(true)}
                  className="px-4 py-2  border-green-500 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaPlus />
                  Add Application
                </Button>
              </div>

              {/* Settings Dialog */}
              <SettingsDialog
                open={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
              />

              <Toaster />
            </div>
            <AddAppDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onAppAdded={refreshAppList}
            />
            <EditAppDialog
              open={isEditDialogOpen}
              app={editApp}
              onOpenChange={setIsEditDialogOpen}
              onAppEdited={refreshAppList}
            />
          </div>
        </ToastProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
