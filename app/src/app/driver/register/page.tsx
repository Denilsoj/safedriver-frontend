"use client";
import { DriverFormProvider } from "@/context/DriverFormContex";
import { DriverForm } from "./DriverForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RegisterDriverPage() {
	return (
		<div className="w-full h-full">
			<main className="w-full h-full">
				<DriverFormProvider>
					<DriverForm />
				</DriverFormProvider>
			</main>
		</div>
	);
}
