// components/AddAppDialog.jsx
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AddAppDialog({ open, onOpenChange, onAppAdded }) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Generate a unique id using name and path
      const id = `${name}-${path}`;
      console.log(id)
      await invoke("add_custom_app", {
        newApp: {
          id,
          name,
          path,
          category: category === "none" ? null : category,
          description,
          icon: null,
        },
      });
      toast.success(`Added ${name} to launcher`);
      setName("");
      setPath("");
      setDescription("");
      setCategory("");
      onOpenChange(false); // Close the dialog
      onAppAdded(); // Trigger a refresh of the app list
    } catch (error) {
      console.error("Failed to add app:", error);
      toast.error(`Failed to add ${name}`);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <Card className="w-full max-w-sm  text-primary">
        <CardHeader className=" p-6 rounded-lg w-full max-w-md">
          <CardTitle className="text-xl font-bold mb-4">
            Add Custom Application
          </CardTitle>
        </CardHeader>
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
            <div>
              <Label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Category
              </Label>
              <Select id="category" value={category || ""} onValueChange={setCategory}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="None" value="none" />
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 mt-6">
            <Button
              variant="destructive"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm text-background rounded"
            >
              Cancel
            </Button>
            <Button type="submit" className="px-4 py-2 text-sm rounded ">
              Add
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
