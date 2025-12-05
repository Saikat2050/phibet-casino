import { toast } from 'react-toastify';

export const isLoggedIn = () => {
  const name = "accessToken";
  const value = `; ${document?.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

export function formatPriceWithCommas(price) {
  if (price) {
    const priceString = price.toString();
    const parts = priceString.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  return 0;
}

export function calculatePercentage(scCoin, scBalance) {
  if (scBalance === 0) {
    return 0; // Avoid division by zero
  }
  return  parseFloat(((scCoin / scBalance) * 100).toFixed(2));
}

export function formatDate(dateString) {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "short", // Abbreviated month
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Set to `true` if you want 12-hour format with AM/PM
  };

  return date.toLocaleString("en-US", options).replace(",", "");
}

export const formatCompactNumber = (num) => {
  if (num === undefined || num === null) return "0";

  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  });

  return formatter.format(num);
};


export const copyToClipboard = async (text) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error("Failed to copy text")
    }
  } else {
    console.error('Clipboard API not supported.');
  }
};