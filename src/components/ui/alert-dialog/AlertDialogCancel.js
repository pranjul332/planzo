// components/ui/alert-dialog/AlertDialogCancel.jsx
import React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "../../../lib/utils";
import { buttonVariants } from "../button/Button";

const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), className)}
    {...props}
  />
));

AlertDialogCancel.displayName = "AlertDialogCancel";

export default AlertDialogCancel;
