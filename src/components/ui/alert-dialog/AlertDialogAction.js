// components/ui/alert-dialog/AlertDialogAction.jsx
import React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "../../../lib/utils";
import { buttonVariants } from "../button/Button";

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
));

AlertDialogAction.displayName = "AlertDialogAction";

export default AlertDialogAction;
