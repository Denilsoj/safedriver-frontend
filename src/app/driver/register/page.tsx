"use client";
import { DriverFormProvider } from "@/context/DriverFormContex";
import { DriverForm } from "./DriverForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RegisterDriverPage() {
	const queryClient = new QueryClient();
	return (
		<div className="w-full h-full">
			<main className="w-full h-full">
				<QueryClientProvider client={queryClient}>
					<DriverFormProvider>
						<DriverForm />
					</DriverFormProvider>
				</QueryClientProvider>
			</main>
		</div>
	);
}
