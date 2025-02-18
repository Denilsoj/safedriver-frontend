import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isAdult = (date: string) => {
	const birth_date = new Date(date);
	const today = new Date();

	const age = today.getFullYear() - birth_date.getFullYear();

	return age > 18;
};
