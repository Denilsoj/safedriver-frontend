"use client";
import { StepIndicator } from "./steps/StepIndicator";
import { useDriverForm } from "@/context/DriverFormContex";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { AddressStep } from "./steps/AddressStep";
import { DocumentsStep } from "./steps/DocumentsStep";

export function DriverForm() {
	const { step } = useDriverForm();

	return (
		<div className="w-full p-6 h-full flex flex-col justify-center">
			<div className="mx-auto bg-white p-5 rounded-lg w- shadow-2xl sm:w-2/5">
				<header className="flex justify-center items-center">
					<img
						src="../../../../logo.png"
						alt="logo"
						className="max-w-36 min-w-16 "
					/>
				</header>
				{step === 0 && <PersonalInfoStep />}
				{step === 1 && <AddressStep />}
				{step === 2 && <DocumentsStep />}

				<div className="mt-4">
					<StepIndicator currentStep={step} totalSteps={3} />
				</div>
			</div>
		</div>
	);
}
