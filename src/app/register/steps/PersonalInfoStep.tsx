"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDriverForm } from "@/context/DriverFormContex";
import { driverSchema } from "@/lib/validation/driver";
import type { PersonalInfoFormData } from "@/types/form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { maskCPF, maskPhone } from "@/lib/utils";

export function PersonalInfoStep() {
	const { updateFormData, setStep, formData } = useDriverForm();

	const form = useForm<PersonalInfoFormData>({
		resolver: zodResolver(driverSchema.shape.personalInfo),
		defaultValues: formData.personalInfo || {
			name: "",
			email: "",
			cpf: "",
			phone: "",
			date_birth: undefined,
		},
	});

	const onSubmit = (data: PersonalInfoFormData) => {
		updateFormData({ personalInfo: data });
		setStep(1);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 gap-6">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nome Completo</FormLabel>
								<FormControl>
									<Input
										autoComplete="name"
										placeholder="Digite seu nome completo"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="date_birth"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Data de Nascimento</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-full pl-3 text-left font-normal",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value ? (
													format(field.value, "dd/MM/yyyy", { locale: ptBR })
												) : (
													<span>Selecione uma data</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											onSelect={field.onChange}
											disabled={(date) =>
												date > new Date() || date < new Date("1900-01-01")
											}
											initialFocus
											captionLayout="dropdown"
											fromYear={1900}
											toYear={new Date().getFullYear()}
											classNames={{
												caption_dropdowns: cn("flex justify-between w-full"),
												vhidden: cn("hidden"),
												dropdown_icon: cn("hidden"),
												dropdown: cn("bg-transparent"),
												caption_label: cn("hidden"),
											}}
											locale={ptBR}
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										autoComplete="email"
										placeholder="seu@email.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="cpf"
						render={({ field }) => (
							<FormItem>
								<FormLabel>CPF</FormLabel>
								<FormControl>
									<Input
										placeholder="000.000.000-00"
										value={maskCPF(field.value)}
										onChange={(e) => {
											const rawValue = e.target.value.replace(/\D/g, "");
											if (rawValue.length <= 11) field.onChange(rawValue);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Telefone</FormLabel>
								<FormControl>
									<Input
										placeholder="(00) 00000-0000"
										value={maskPhone(field.value)}
										onChange={(e) => {
											const rawValue = e.target.value.replace(/\D/g, "");
											if (rawValue.length <= 11) field.onChange(rawValue);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end space-x-4">
					<Button type="submit">Próximo</Button>
				</div>
			</form>
		</Form>
	);
}
