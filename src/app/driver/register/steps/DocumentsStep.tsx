"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDriverForm } from "@/context/DriverFormContex";
import { driverSchema } from "@/lib/validation/driver";
import { useTransition } from "react";
import type { DocumentsFormData } from "@/types/form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function DocumentsStep() {
	const { updateFormData, setStep, formData } = useDriverForm();
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();
	const form = useForm<DocumentsFormData>({
		resolver: zodResolver(driverSchema.shape.documents),
		defaultValues: formData.documents,
	});
	const mutation = useMutation({
		mutationFn: async (completeFormData: FormData) => {
			const response = await fetch("http://localhost:8080/driver", {
				method: "POST",
				body: completeFormData,
			});

			if (!response.ok) {
				const errorResponse = await response.json();
				console.log(errorResponse.code === "P2002");
				if (errorResponse.code === "P2002") {
					throw new Error("Motorista já cadastrado no sistema");
				}

				throw new Error("Erro ao registrar motorista");
			}
		},
		onSuccess: (data) => {
			startTransition(() => {
				toast({
					title: "Sucesso!",
					description: "Cadastro realizado com sucesso.",
				});
			});
		},
		onError: (error) => {
			toast({
				title: "Erro",
				description: error.message,
				variant: "destructive",
			});
		},
	});
	const onSubmit = async (data: DocumentsFormData) => {
		updateFormData({ documents: data });
		const formDataToSubmit = new FormData();
		if (formData.personalInfo) {
			for (const [key, value] of Object.entries(formData.personalInfo)) {
				if (value !== undefined && value !== null) {
					formDataToSubmit.append(key, String(value));
				}
			}
		}
		if (formData.address) {
			formDataToSubmit.append(
				"address",
				JSON.stringify({
					street: formData.address.street,
					number: formData.address.number,
					city: formData.address.city,
					state: formData.address.state,
					zip_code: formData.address.zip_code,
				}),
			);
		}
		if (data.src_cnh?.[0]) {
			formDataToSubmit.append("src_cnh", data.src_cnh[0]);
		}
		if (data.src_crlv?.[0]) {
			formDataToSubmit.append("src_crlv", data.src_crlv[0]);
		}
		for (const [key, value] of formDataToSubmit.entries()) {
			console.log(key, value);
		}
		mutation.mutate(formDataToSubmit);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="src_cnh"
					render={({ field }) => (
						<FormItem>
							<FormLabel>CNH</FormLabel>
							<FormControl>
								<Input
									type="file"
									accept=".jpg,.jpeg,.png,.pdf"
									onChange={(e) => {
										field.onChange(e.target.files);
									}}
									className="mt-1 block w-full"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="src_crlv"
					render={({ field }) => (
						<FormItem>
							<FormLabel>CRLV</FormLabel>
							<FormControl>
								<Input
									type="file"
									accept=".jpg,.jpeg,.png,.pdf"
									onChange={(e) => {
										field.onChange(e.target.files);
									}}
									className="mt-1 block w-full"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex space-x-4">
					<Button
						type="button"
						variant="secondary"
						onClick={() => setStep(1)}
						className="w-full"
					>
						Voltar
					</Button>
					<Button type="submit" disabled={isPending} className="w-full">
						{isPending ? "Enviando..." : "Finalizar Cadastro"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
