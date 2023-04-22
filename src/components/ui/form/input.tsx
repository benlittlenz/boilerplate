import * as React from "react";

import cx from "classnames"
import { type FieldError, type UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper } from "./field-wrapper";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | undefined;
  registration?: Partial<UseFormRegisterReturn>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, registration, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error}>
        <input
          className={cx(
            "flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
            className
          )}
          ref={ref}
          {...registration}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Input.displayName = "Input";

export { Input };
