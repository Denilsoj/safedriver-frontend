"use client";

type StepIndicatorProps = {
	currentStep: number;
	totalSteps: number;
	steps?: string[];
};

export function StepIndicator({
	currentStep,
	totalSteps,
	steps = ["Dados Pessoais", "Endereço", "Documentos"],
}: StepIndicatorProps) {
	return (
		<div className="py-4">
			<div className="flex justify-between">
				{steps.map((step, index) => (
					<div key={step} className="flex flex-col items-center">
						<div
							className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${index <= currentStep ? "bg-nectar-extra-color-1 text-white" : "bg-gray-200 text-gray-600"}
            `}
						>
							{index + 1}
						</div>
						<span className="text-sm mt-2">{step}</span>
					</div>
				))}
			</div>
			<div className="mt-2 h-2 bg-gray-200 rounded-full">
				<div
					className="h-full bg-nectar-extra-color-1 rounded-full transition-all duration-300"
					style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
				/>
			</div>
		</div>
	);
}
