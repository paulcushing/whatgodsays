import type { Truth } from "@/data/verseUtils";

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function hash(input: string): number {
  let value = 0;
  for (let i = 0; i < input.length; i++) {
    value = (value * 31 + input.charCodeAt(i)) >>> 0;
  }
  return value;
}

export function getDailyTruth(date: Date, truths: Truth[]): Truth {
  return truths[hash(dateKey(date)) % truths.length] ?? truths[0];
}

export function formatToday(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function greetingForDate(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
