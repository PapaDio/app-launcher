import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import type { AppItem } from "../types";

interface EditAppDialogProps {
  open: boolean;
  app: AppItem | null;
  onOpenChange: (open: boolean) => void;
  onAppEdited: () => void;
}

export function EditAppDialog({
  open,
  app,
  onOpenChange,
  onAppEdited,
}: EditAppDialogProps) {
  const [name, setName] = useState(app?.name || "");
  const [path, setPath] = useState(app?.path || "");
  const [category, setCategory] = useState(app?.category || "");
  const [description, setDescription] = useState(app?.description || "");

  // Update fields when app changes
  useEffect(() => {
    setName(app?.name || "");
    setPath(app?.path || "");
    setCategory(app?.category || "");
    setDescription(app?.description || "");
  }, [app]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // App should always be defined when dialog is open
    try {
      await invoke("edit_custom_app", {
        appId: app!.id,
        updatedApp: {
          id: app!.id,
          name,
          path,
          category: category === "none" ? null : category,
          description,
          icon: app!.icon || null,
        },
      });
      toast.success(`Edited ${name}`);
      onOpenChange(false);
      onAppEdited();
    } catch (error) {
      console.error("Failed to edit app:", error);
      toast.error(`Failed to edit ${name}`);
    }
  };

  // Only render dialog if open and app is selected
  if (!open || !app) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-sm text-primary">
        <CardHeader className="p-6 rounded-lg w-full max-w-md">
          <CardTitle className="text-xl font-bold mb-4">
            Edit Application
          </CardTitle>
        </CardHeader>
        {app ? (
          <form onSubmit={handleSubmit}>
            <CardContent>
             <Label htmlFor="name" className="block text-sm font-medium mb-1">
              App Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded border "
              required
            />
            <div>
              <Label htmlFor="path" className="block text-sm font-medium mb-1">
                Executable Path
              </Label>
              <Input
                id="path"
                type="file"
                accept=".exe"
                className="w-full p-2 rounded border"
                required
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setPath(file.path || file.name);
                }}
              />
              </div>
              <Label
                htmlFor="category"
                className="block text-sm font-medium mb-1 mt-2"
              >
                Category
              </Label>
              <Select
                id="category"
                value={category || ""}
                onValueChange={setCategory}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select the category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Gaming">Gaming</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                </SelectContent>
              </Select>
              <Label
                htmlFor="description"
                className="block text-sm font-medium mb-1 mt-2"
              >
                Description
              </Label>
              <Input
                id="description"
                type="text"
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded border"
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 mt-6">
              <Button
                variant="destructive"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm text-background rounded"
              >
                Cancel
              </Button>
              <Button type="submit" className="px-4 py-2 text-sm rounded">
                Save
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent>
            <p className="text-center text-muted-foreground">
              No app selected for editing.
            </p>
            <CardFooter className="flex justify-end gap-2 mt-6">
              <Button
                variant="destructive"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm text-background rounded"
              >
                Close
              </Button>
            </CardFooter>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
