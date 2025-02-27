import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isAdult = (date: Date | string) => {
	const birth_date = typeof date === "string" ? new Date(date) : date;
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const debounce = (func: (...args: any) => void, delay: number) => {
	let timer: NodeJS.Timeout;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (...args: any[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => func(...args), delay);
	};
};

export const maskCPF = (value: string): string => {
	return value
		.replace(/\D/g, "")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const maskPhone = (value: string): string => {
	if (value) {
		return value
			.replace(/\D/g, "")
			.replace(/(\d{2})(\d)/, "($1) $2")
			.replace(/(\d{5})(\d)/, "$1-$2")
			.slice(0, 15);
	}
	return "";
};
