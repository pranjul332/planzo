// components/ui/dialog/DialogFooter.jsx
import React from "react";
import { cn } from "../../../lib/utils";

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);

DialogFooter.displayName = "DialogFooter";

export default DialogFooter;
