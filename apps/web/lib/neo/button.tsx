import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "~/components/ui/form/button";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onStatic?: React.ReactNode;
  onAction?: React.ReactNode;
}

export const ReactButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onAction = "Saving..", onStatic = "Save", ...props }, ref) => {
    const { pending } = useFormStatus();

    return (
      <Button type="submit" disabled={pending} {...props} ref={ref}>
        {pending ? onAction : onStatic}
      </Button>
    );
  }
);
