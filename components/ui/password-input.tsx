"use client";

import * as React from "react";
import {
  PasswordToggleField,
  PasswordToggleFieldInput,
  PasswordToggleFieldIcon,
  PasswordToggleFieldToggle,
} from "@radix-ui/react-password-toggle-field";
import { ViewOffSlashIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof PasswordToggleFieldInput>, "type"> {
  containerClassName?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center", containerClassName)}>
        <PasswordToggleField>
        <PasswordToggleFieldInput
          ref={ref}
          className={cn(
            "h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 pr-10",
            className
          )}
          {...props}
        />
        <PasswordToggleFieldToggle
          className="absolute right-3 z-10 cursor-pointer text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Toggle password visibility"
        >
          <PasswordToggleFieldIcon
            visible={<HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />}
            hidden={<HugeiconsIcon icon={ViewOffSlashIcon} className="h-4 w-4" />}
          />
        </PasswordToggleFieldToggle>
        </PasswordToggleField>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };