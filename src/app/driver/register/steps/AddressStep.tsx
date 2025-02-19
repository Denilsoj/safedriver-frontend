"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDriverForm } from "@/context/DriverFormContex";
import { driverSchema } from "@/lib/validation/driver";
import type { AddressFormData } from "@/types/form";

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

import { applyZipMask, debounce } from "@/lib/utils";

export function AddressStep() {
	const { updateFormData, setStep, formData } = useDriverForm();

	const form = useForm<AddressFormData>({
		resolver: zodResolver(driverSchema.shape.address),
		defaultValues: formData.address || {
			zip_code: "",
			street: "",
			number: "",
			city: "",
			state: "",
		},
	});

	const handleZipChange = async (zip: string) => {
		if (zip.length === 9 && /^[0-9]{5}-[0-9]{3}$/.test(zip)) {
			try {
				const response = await fetch(
					`https://viacep.com.br/ws/${zip.replace("-", "")}/json/`,
				);

				if (!response.ok) {
					throw new Error("Erro ao buscar CEP");
				}

				const data = await response.json();
				if (data.erro) {
					console.error("CEP não encontrado.");
					return;
				}

				form.setValue("street", data.logradouro || "");
				form.setValue("city", data.localidade || "");
				form.setValue("state", data.uf || "");
			} catch (error) {
				return "Erro ao buscar CEP";
			}
		}
	};

	const debouncedHandleZipChange = debounce(handleZipChange, 500);

	const onSubmit = (data: AddressFormData) => {
		updateFormData({ address: data });
		setStep(2);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="zip_code"
					render={({ field }) => (
						<FormItem>
							<FormLabel>CEP</FormLabel>
							<FormControl>
								<Input
									placeholder="12345-678"
									value={applyZipMask(field.value)}
									onChange={(e) => {
										const rawValue = e.target.value.replace(/\D/g, "");
										field.onChange(rawValue);
										debouncedHandleZipChange(applyZipMask(rawValue));
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="street"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Rua</FormLabel>
							<FormControl>
								<Input placeholder="Rua Exemplo" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Número</FormLabel>
							<FormControl>
								<Input placeholder="123" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="city"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Cidade</FormLabel>
								<FormControl>
									<Input placeholder="São Paulo" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="state"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estado</FormLabel>
								<FormControl>
									<Input maxLength={2} placeholder="SP" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex space-x-4">
					<Button
						type="button"
						variant="secondary"
						onClick={() => setStep(0)}
						className="w-full"
					>
						Voltar
					</Button>
					<Button type="submit" className="w-full">
						Próximo
					</Button>
				</div>
			</form>
		</Form>
	);
}
