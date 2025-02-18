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

export const applyZipMask = (value: string): string => {
	const numericValue = value.replace(/\D/g, "");
	if (numericValue.length <= 5) {
		return numericValue;
	}
	return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
};
