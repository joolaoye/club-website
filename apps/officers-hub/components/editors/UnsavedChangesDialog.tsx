"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@club-website/ui/components/dialog";
import { Button } from "@club-website/ui/components/button";
import { AlertTriangle } from "lucide-react";

interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center">
            <div>
              <DialogTitle>Unsaved Changes</DialogTitle>
              <DialogDescription className="mt-1">
                You have unsaved changes that will be lost if you leave this page.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Stay on Page
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Leave Without Saving
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
