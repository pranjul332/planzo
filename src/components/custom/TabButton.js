// components/custom/TabButton.jsx
import React from "react";
import { cn } from "../../lib/utils";

export const TabButton = ({
  icon: Icon,
  title,
  description,
  value,
  currentValue,
  onClick,
  className,
}) => {
  const isActive = value === currentValue;

  return (
    <button
      type="button"
      className={cn(
        "w-full text-left px-4 py-3 rounded-md transition-colors",
        isActive ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-gray-100",
        className
      )}
      onClick={() => onClick(value)}
    >
      <div className="flex items-start">
        {Icon && (
          <div
            className={cn(
              "mr-3 mt-0.5 p-2 rounded-full",
              isActive ? "bg-primary/15" : "bg-gray-100"
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div>
          <p
            className={cn(
              "font-medium text-sm",
              isActive ? "text-primary" : "text-gray-900"
            )}
          >
            {title}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </button>
  );
};
