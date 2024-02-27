import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeUrlString(encodedString: string): string {
  // Use decodeURIComponent to decode the URL-encoded string
  return decodeURIComponent(encodedString);
}
