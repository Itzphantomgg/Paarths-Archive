import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function formatStoryDate(
  storyOrApprox?:
    | {
        approximateDate?: string | null;
        year?: number | null;
        exactDate?: Date | string | null;
      }
    | string
    | null,
  exactDate?: Date | string | null,
  year?: number | null
): string {
  if (storyOrApprox && typeof storyOrApprox === "object") {
    if (storyOrApprox.approximateDate) return storyOrApprox.approximateDate;
    if (storyOrApprox.year) return `Circa ${storyOrApprox.year}`;
    if (storyOrApprox.exactDate) {
      return new Date(storyOrApprox.exactDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "Date Unrecorded";
  }

  const approx = typeof storyOrApprox === "string" ? storyOrApprox : null;
  if (approx) return approx;
  if (year) return `Circa ${year}`;
  if (exactDate) {
    return new Date(exactDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return "Date Unrecorded";
}
