"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "~/components/ui/form/button";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Content to show when the button is in its normal state */
  onStatic: React.ReactNode;
  /** Content to show when the button is in a loading state */
  onAction: React.ReactNode;
  /** Whether to show a spinner when loading (default: true) */
  showSpinner?: boolean;
  /** Position of the spinner relative to the text (default: "right") */
  spinnerPosition?: "left" | "right";
  /** Custom spinner component */
  spinner?: React.ReactNode;
}

export const ReactButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      onAction = "Saving",
      onStatic = "Save",
      showSpinner = true,
      spinnerPosition = "right",
      spinner = <Loader2 className="h-4 w-4 animate-spin" />,
      ...props
    },
    ref,
  ) => {
    const { pending } = useFormStatus();
    const content = pending ? onAction : onStatic;
    const shouldShowSpinner = pending && showSpinner;

    return (
      <Button
        type={props.type || "submit"}
        disabled={props.disabled || pending}
        {...props}
        ref={ref}
      >
        {shouldShowSpinner && spinnerPosition === "left" && spinner}
        {content}
        {shouldShowSpinner && spinnerPosition === "right" && spinner}
      </Button>
    );
  },
);

ReactButton.displayName = "ReactButton";
