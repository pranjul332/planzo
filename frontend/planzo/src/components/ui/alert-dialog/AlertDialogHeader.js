// components/ui/alert-dialog/AlertDialogHeader.jsx
import React from "react";
import { cn } from "../../../lib/utils";

const AlertDialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);

AlertDialogHeader.displayName = "AlertDialogHeader";

export default AlertDialogHeader;
