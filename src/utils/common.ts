export const formatRupiah = (value?: number) => {
  if (!value && value !== 0) return "";
  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat(`id-ID`, {
    currency: `IDR`,
    style: "currency",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(numberValue);
};

export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const parseRupiah = (formattedValue?: string) => {
  if (formattedValue === undefined || formattedValue === null) {
    return undefined; // Or handle as you prefer
  }

  // Remove non-numeric characters (Rp, ., and whitespace)
  const cleanedValue = formattedValue.replace(/[^0-9,]/g, "").replace(",", ".");

  // Parse the cleaned string to a number
  const parsedValue = parseFloat(cleanedValue);

  return isNaN(parsedValue) ? undefined : parsedValue;
};

export const freeTrialError = {
  data: {
    status: 400,
  },
  count: 0,
  error: {
    message: "Your free trial has ended!",
    code: 400,
  },
  status: 400,
};
