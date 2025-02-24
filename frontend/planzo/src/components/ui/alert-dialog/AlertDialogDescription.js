// components/ui/alert-dialog/AlertDialogDescription.jsx
import React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "../../../lib/utils";

const AlertDialogDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  )
);

AlertDialogDescription.displayName = "AlertDialogDescription";

export default AlertDialogDescription;
