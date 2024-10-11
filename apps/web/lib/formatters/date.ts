export const getFormattedDate = (date: Date): string => {
  return Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date);
};

export function formatDateToDDMMYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${day}/${month}/${year}`;
}

export const getFormattedDateActivityDetails = (date: Date): string => {
  return Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date);
};

export const fullFormatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const time = date.toLocaleTimeString("en-US", timeOptions);
  const datePart = date.toLocaleDateString("en-US", dateOptions);

  const day = date.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${time} ${day}${daySuffix} ${datePart}`;
};

export const fullFormatDate2 = (dateString: string): string => {
  const date = new Date(dateString);

  // Options for formatting the time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Get the time part
  const time = date.toLocaleTimeString("en-US", timeOptions);

  // Formatting the date as DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  // Combine time and date
  return `${time} ${day}/${month}/${year}`;
};
