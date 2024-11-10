import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isValidDate(value: string) {
    const date = new Date(value);
    return !isNaN(date.getTime());
}

export function diffInDays(from: Date, to: Date) {
    const oneDayInMs = 1000 * 60 * 60 * 24;
    const fromMs = from.getTime();
    const toMs = to.getTime();
    const differenceInMs = Math.abs(toMs - fromMs);
    return Math.floor(differenceInMs / oneDayInMs);
}
