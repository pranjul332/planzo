// components/custom/DeleteConfirmationDialog.jsx
import React from "react";
import AlertDialog from "../ui/alert-dialog/AlertDialog";
import AlertDialogAction from "../ui/alert-dialog/AlertDialogAction";
import AlertDialogCancel from "../ui/alert-dialog/AlertDialogCancel";
import AlertDialogContent from "../ui/alert-dialog/AlertDialogContent";
import AlertDialogDescription from "../ui/alert-dialog/AlertDialogDescription";
import AlertDialogFooter from "../ui/alert-dialog/AlertDialogFooter";
import AlertDialogHeader from "../ui/alert-dialog/AlertDialogHeader";
import AlertDialogTitle from "../ui/alert-dialog/AlertDialogTitle";

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone. This will permanently delete the group and all its associated data.",
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
