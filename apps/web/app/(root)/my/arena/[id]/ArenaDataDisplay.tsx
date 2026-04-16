import React, { useMemo } from "react";
import clsx from "clsx";

type DataDisplayProps = {
  label: string;
  value?: string;
  placeholder?: string;
  containerClass?: string;
  labelClass?: string;
  valueClass?: string;
  minWidth?: 1 | 2 | 3 | 4 | 5 | 6;
  maxWidth?: 7 | 8 | 9 | 10 | 11 | 12;
  truncate?: boolean;
  borderColor?: string;
  randomWidth?: boolean;
  widthVariety?: "subtle" | "medium" | "extreme";
};

const WIDTH_VARIETIES = {
  1: "w-fit",
  2: "w-2/12",
  3: "w-3/12",
  4: "w-4/12",
  5: "w-5/12",
  6: "w-6/12",
  7: "w-7/12",
  8: "w-8/12",
  9: "w-9/12",
  10: "w-10/12",
  11: "w-11/12",
  12: "w-full",
} as const;

export const ArenaDataDisplay = ({
  label,
  value,
  placeholder = "Not specified",
  containerClass = "",
  labelClass = "",
  valueClass = "",
  minWidth = 1,
  maxWidth = 12,
  truncate = true,
  borderColor = "border-rose-600",
  randomWidth = true,
  widthVariety = "medium",
}: DataDisplayProps) => {
  const randomWidthClass = useMemo(() => {
    if (!randomWidth) return WIDTH_VARIETIES[maxWidth];

    // Create array of available widths between min and max
    const availableWidths: (keyof typeof WIDTH_VARIETIES)[] = [];
    for (let i = minWidth; i <= maxWidth; i++) {
      availableWidths.push(i as keyof typeof WIDTH_VARIETIES);
    }

    // Apply variety weights
    const weights = {
      subtle: [5, 4, 3, 2, 1],
      medium: [3, 2, 1, 1, 1],
      extreme: [1, 1, 1, 1, 1],
    }[widthVariety];

    // Create weighted distribution
    const weightedOptions = availableWidths
      .map((width, index) => {
        const weight = weights[Math.min(index, weights.length - 1)];
        return Array(weight).fill(width);
      })
      .flat();

    // Random selection from weighted options
    const randomIndex = Math.floor(Math.random() * weightedOptions.length);
    return WIDTH_VARIETIES[weightedOptions[randomIndex]];
  }, [minWidth, maxWidth, randomWidth, widthVariety]);

  return (
    <div className={clsx("container mt-5", containerClass)}>
      <label
        className={clsx(
          "flex text-gray-800 font-semibold dark:text-white pb-1",
          labelClass,
        )}
      >
        {label}
      </label>

      <div className={clsx(truncate ? "truncate" : "", "min-w-min max-w-full")}>
        <p
          className={clsx(
            "text-black text-sm focus:ring-blue-500 focus:border-blue-500",
            "block ps-3 p-2.5 dark:text-white",
            "bg-slate-100 dark:bg-inherit",
            "text-wrap rounded-3xl border-2",
            borderColor,
            // randomWidthClass,
            "w-fit pl-10 pr-16",
            !value && "dark:text-gray-500",
            valueClass,
            {
              "whitespace-nowrap": truncate,
              "break-words": !truncate,
            },
          )}
        >
          {value || placeholder}
        </p>
      </div>
    </div>
  );
};
