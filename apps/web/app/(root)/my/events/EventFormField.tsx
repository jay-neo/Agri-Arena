"use client";

import React from "react";

type InputProps = React.ComponentProps<"input">;
type TextareaProps = React.ComponentProps<"textarea">;
type SelectProps = React.ComponentProps<"select"> & {
  options?: { value: string; label: string }[];
};

interface BaseFormFieldProps {
  label?: string;
  name: string;
  required?: boolean;
  error?: string[];
  className?: string;
  children?: React.ReactNode;
}

type FormFieldProps =
  | ({ component?: "input" } & InputProps & BaseFormFieldProps)
  | ({ component: "textarea" } & TextareaProps & BaseFormFieldProps)
  | ({ component: "select" } & SelectProps & BaseFormFieldProps);

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  component = "input",
  required = false,
  error,
  className = "",
  children,
  ...rest
}) => {
  const baseClasses =
    "w-full p-2 border rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";
  const inputClasses = error
    ? "border-red-600"
    : "border-gray-300 dark:border-gray-600";

  const renderElement = () => {
    switch (component) {
      case "textarea":
        return (
          <textarea
            name={name}
            id={name}
            required={required}
            className={`${baseClasses} ${inputClasses} min-h-[100px]px-1}`}
            {...(rest as TextareaProps)}
          />
        );
      case "select":
        const { options, ...selectProps } = rest as SelectProps;
        return (
          <select
            name={name}
            id={name}
            required={required}
            className={`${baseClasses} ${inputClasses}`}
            {...selectProps}
          >
            <option value="">Select an option</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "input":
      default:
        return (
          <input
            name={name}
            id={name}
            required={required}
            className={`${baseClasses} ${inputClasses}`}
            {...(rest as InputProps)}
          />
        );
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-gray-700 dark:text-gray-200 text-sm mb-1"
        >
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}
      {renderElement()}
      {error && <p className="text-red-600 text-sm mt-1">{error[0]}</p>}
      {children}
    </div>
  );
};

export default FormField;
