"use client";

import { createContext, useContext, useState } from "react";
import type { DriverFormData } from "@/lib/validation/driver";

type DriverFormContextType = {
	step: number;
	setStep: (step: number) => void;
	formData: Partial<DriverFormData>;
	updateFormData: (data: Partial<DriverFormData>) => void;
};

const DriverFormContext = createContext<DriverFormContextType | null>(null);

export function DriverFormProvider({
	children,
}: { children: React.ReactNode }) {
	const [step, setStep] = useState(0);
	const [formData, setFormData] = useState<Partial<DriverFormData>>({});

	const updateFormData = (newData: Partial<DriverFormData>) => {
		setFormData((prev) => ({ ...prev, ...newData }));
	};

	return (
		<DriverFormContext.Provider
			value={{ step, setStep, formData, updateFormData }}
		>
			{children}
		</DriverFormContext.Provider>
	);
}

export const useDriverForm = () => {
	const context = useContext(DriverFormContext);
	if (!context)
		throw new Error("useDriverForm must be used within DriverFormProvider");
	return context;
};
