// components/ui/alert-dialog/AlertDialogFooter.jsx
import React from "react";
import { cn } from "../../../lib/utils";

const AlertDialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);

AlertDialogFooter.displayName = "AlertDialogFooter";

export default AlertDialogFooter;
