"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDriverForm } from "@/context/DriverFormContex";
import { enhancedDocumentSchema } from "@/lib/validation/driver";
import { useRouter } from "next/navigation";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { storeDriver } from "@/services/driverServices";

export function DocumentsStep() {
	const { updateFormData, setStep, formData } = useDriverForm();
	const { toast } = useToast();
	const router = useRouter();
	const queryClient = useQueryClient();

	const form = useForm<DocumentsFormData>({
		resolver: zodResolver(enhancedDocumentSchema),
		defaultValues: {
			src_cnh: undefined,
			src_crlv: undefined,
		},
		mode: "onChange",
	});

	const { isSubmitting, isDirty, isValid } = form.formState;

	const mutation = useMutation({
		mutationFn: (data: FormData) => storeDriver(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["drivers"] });
			toast({
				title: "Sucesso!",
				description: "Cadastro realizado com sucesso.",
			});
			router.push("/");
		},
		onError: (error: Error) => {
			toast({
				title: "Erro no cadastro",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const onSubmit = async (data: DocumentsFormData) => {
		try {
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

			if (data.src_cnh) {
				formDataToSubmit.append("src_cnh", data.src_cnh);
			}

			if (data.src_crlv) {
				formDataToSubmit.append("src_crlv", data.src_crlv);
			}

			mutation.mutate(formDataToSubmit);
		} catch (error) {
			console.error("Erro ao preparar dados:", error);
			toast({
				title: "Erro",
				description: "Falha ao preparar dados para envio",
				variant: "destructive",
			});
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid gap-6">
					<FormField
						control={form.control}
						name="src_cnh"
						render={({ field: { onChange, ...field } }) => (
							<FormItem>
								<FormLabel className="text-base font-semibold">
									CNH do Motorista <span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<div className="flex flex-col gap-2">
										<Input
											type="file"
											accept=".jpg,.jpeg,.png,.pdf"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													onChange(file);
													form.trigger("src_cnh");
												}
											}}
											className="mt-1 block w-full cursor-pointer"
										/>
										{field.value && (
											<p className="text-sm text-gray-500">
												Arquivo selecionado: {(field.value as File).name}
												{" ("}
												{((field.value as File).size / 1024 / 1024).toFixed(2)}
												MB{")"}
											</p>
										)}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="src_crlv"
						render={({ field: { onChange, ...field } }) => (
							<FormItem>
								<FormLabel className="text-base font-semibold">
									CRLV do Veículo <span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<div className="flex flex-col gap-2">
										<Input
											type="file"
											accept=".jpg,.jpeg,.png,.pdf"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													onChange(file);
													form.trigger("src_crlv");
												}
											}}
											className="mt-1 block w-full cursor-pointer"
										/>
										{field.value && (
											<p className="text-sm text-gray-500">
												Arquivo selecionado: {(field.value as File).name}
												{" ("}
												{((field.value as File).size / 1024 / 1024).toFixed(2)}
												MB{")"}
											</p>
										)}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{mutation.isError && (
					<div className="p-3 rounded bg-red-50 text-red-700 border border-red-200">
						<p className="font-medium">Erro no envio do formulário</p>
						<p>{mutation.error.message}</p>
					</div>
				)}

				<div className="flex space-x-4 mt-8">
					<Button
						type="button"
						variant="secondary"
						onClick={() => setStep(1)}
						className="w-full"
						disabled={isSubmitting || mutation.isPending}
					>
						Voltar
					</Button>
					<Button
						type="submit"
						className="w-full"
						disabled={
							isSubmitting || mutation.isPending || (!isDirty && !isValid)
						}
					>
						{mutation.isPending || isSubmitting
							? "Enviando..."
							: "Finalizar Cadastro"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
