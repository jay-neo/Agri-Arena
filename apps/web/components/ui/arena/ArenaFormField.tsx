"use client";

import clsx from "clsx";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

function capitalize(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  // Allow: backspace, delete, tab, escape, enter, decimal point
  if (
    ["Backspace", "Delete", "Tab", "Escape", "Enter", "."].includes(e.key) ||
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    (e.ctrlKey === true && ["a", "c", "v", "x"].includes(e.key)) ||
    // Allow: home, end, left, right
    ["Home", "End", "ArrowLeft", "ArrowRight"].includes(e.key)
  ) {
    return;
  }

  // Ensure that it's a number and stop the keypress if not
  if (isNaN(Number(e.key))) {
    e.preventDefault();
  }
};

type InputTypes = "text" | "textarea" | "email" | "password" | "number";

type BaseProps = {
  id: string;
  name?: string;
  label?: string;
  type?: InputTypes;
  errors?: string[] | string;
  containerClass?: string;
  labelClass?: string;
  errorClass?: string;
  inputClass?: string;
  required?: boolean;
  disabled?: boolean;
};

type InputProps = BaseProps & {
  type?: Exclude<InputTypes, "textarea">;
} & InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = BaseProps & {
  type: "textarea";
  rows?: number;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

type ArenaFormFieldProps = InputProps | TextareaProps;

const DEFAULT_CLASSES = {
  container: "container mt-5",
  label: "flex w-full pb-1",
  error: "text-sm text-red-500 dark:text-yellow-400",
  input:
    "text-sm block ps-3 p-2.5 bg-black/20 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700",
};

export const ArenaFormField = ({
  id,
  name,
  label,
  type = "text",
  errors,
  containerClass = "",
  labelClass = "",
  errorClass = "",
  inputClass = "",
  required = false,
  disabled = false,
  ...props
}: ArenaFormFieldProps) => {
  const containerClasses = clsx(DEFAULT_CLASSES.container, containerClass);
  const labelClasses = clsx(DEFAULT_CLASSES.label, labelClass);
  const errorClasses = clsx(DEFAULT_CLASSES.error, errorClass);
  const inputClasses = clsx(DEFAULT_CLASSES.input, inputClass);

  const renderInput = () => {
    if (type === "textarea") {
      const { rows = 1, ...rest } = props as TextareaProps;
      return (
        <textarea
          id={id}
          name={name || id}
          rows={rows}
          className={inputClasses}
          required={required}
          disabled={disabled}
          {...rest}
        />
      );
    }

    const { onKeyDown, ...rest } = props as InputProps;
    return (
      <input
        id={id}
        name={name || id}
        type={type}
        className={inputClasses}
        required={required}
        disabled={disabled}
        onKeyDown={(e) => {
          if (type === "number") {
            handleNumberInput(e);
          }
          onKeyDown?.(e);
        }}
        {...rest}
      />
    );
  };

  return (
    <div className={containerClasses}>
      <label htmlFor={id} className={labelClasses}>
        {label ? label : capitalize(name || id)}
        {required && (
          <span className="text-red-500 ml-1 font-extralight">*</span>
        )}
      </label>

      {renderInput()}

      {errors && (
        <div className={errorClasses}>
          {Array.isArray(errors) ? (
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : (
            <p>{errors}</p>
          )}
        </div>
      )}
    </div>
  );
};
