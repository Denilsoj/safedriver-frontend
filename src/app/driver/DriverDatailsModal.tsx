"use client";

import { useState, useRef, useEffect } from "react";
import { applyZipMask, maskCPF, maskPhone } from "@/lib/utils";
import { Edit, MoreHorizontal, Save, Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format, set } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import { type Driver, driverFormSchemaUpdated } from "@/lib/validation/driver";
import { updateDriverData } from "@/services/driverServices";

type DriverFormValues = z.infer<typeof driverFormSchemaUpdated>;

export default function DriverDetailsModal({
	driver,
}: {
	driver: Driver;
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("personal");

	const formatedDate = new Date(driver.date_birth);
	const form = useForm<DriverFormValues>({
		resolver: zodResolver(driverFormSchemaUpdated),
		defaultValues: {
			...driver,
			date_birth: new Date(driver.date_birth),
			status: driver.status as "Ativo" | "Inativo",
		},
	});

	const cnhInputRef = useRef<HTMLInputElement>(null);
	const crlvInputRef = useRef<HTMLInputElement>(null);

	const [cnhPreview, setCnhPreview] = useState<string | null>(
		driver.src_cnh || null,
	);
	const [crlvPreview, setCrlvPreview] = useState<string | null>(
		driver.src_crlv || null,
	);
	const [cnhFile, setCnhFile] = useState<File | null>(null);
	const [crlvFile, setCrlvFile] = useState<File | null>(null);
	const queryClient = useQueryClient();
	const updateDriverMutation = useMutation({
		mutationFn: (data: FormData) => updateDriverData(data),
		onSuccess: () => {
			toast({
				title: "Motorista atualizado",
				description: "Os dados do motorista foram atualizados com sucesso.",
			});
			queryClient.invalidateQueries({ queryKey: ["drivers"] });
			setIsEditing(false);
			setIsOpen(false);
		},
		onError: (error) => {
			toast({
				title: "Erro",
				description: "Ocorreu um erro ao atualizar o motorista.",
				variant: "destructive",
			});
		},
	});

	const onSubmit = (data: DriverFormValues) => {
		const formData = new FormData();

		for (const [key, value] of Object.entries(data)) {
			if (key !== "address" && key !== "src_cnh" && key !== "src_crlv") {
				formData.append(key, String(value));
			}
		}
		if (data.address) {
			formData.append(
				"address",
				JSON.stringify({
					street: data.address.street,
					number: data.address.number,
					city: data.address.city,
					state: data.address.state,
					zip_code: data.address.zip_code,
				}),
			);
		}
		if (cnhFile) {
			formData.append("src_cnh", cnhFile);
		}

		if (crlvFile) {
			formData.append("src_crlv", crlvFile);
		}
		updateDriverMutation.mutate(formData);
	};
	const MAX_FILE_SIZE = 10 * 1024 * 1024;
	const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
	const handleCnhUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			const file = e.target.files[0];

			if (file.size > MAX_FILE_SIZE) {
				toast({
					title: "Arquivo muito grande",
					description: "O arquivo deve ter no máximo 10MB.",
					variant: "destructive",
				});
				return;
			}

			if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
				toast({
					title: "Formato inválido",
					description:
						"Por favor, selecione uma imagem nos formatos PNG, JPEG, JPG.",
					variant: "destructive",
				});
				return;
			}

			const imageUrl = URL.createObjectURL(file);
			setCnhPreview(imageUrl);
			setCnhFile(file);
			form.setValue("src_cnh", e.target.files);
		}
	};

	const handleCrlvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			const file = e.target.files[0];

			if (file.size > MAX_FILE_SIZE) {
				toast({
					title: "Arquivo muito grande",
					description: "O arquivo deve ter no máximo 5MB.",
					variant: "destructive",
				});
				return;
			}

			if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
				toast({
					title: "Formato inválido",
					description:
						"Por favor, selecione uma imagem nos formatos PNG, JPEG, JPG.",
					variant: "destructive",
				});
				return;
			}

			const imageUrl = URL.createObjectURL(file);
			setCrlvPreview(imageUrl);
			setCrlvFile(file);
			form.setValue("src_crlv", e.target.files);
		}
	};
	const removePreview = (type: "cnh" | "crlv") => {
		if (type === "cnh") {
			setCnhPreview(null);
			setCnhFile(null);
			if (cnhInputRef.current) cnhInputRef.current.value = "";
			form.setValue("src_cnh", "");
		} else {
			setCrlvPreview(null);
			setCrlvFile(null);
			if (crlvInputRef.current) crlvInputRef.current.value = "";
			form.setValue("src_crlv", "");
		}
	};

	const handleCancel = () => {
		form.reset({
			...driver,
			date_birth: formatedDate.toISOString().split("T")[0],
			status: driver.status as "Ativo" | "Inativo",
		});
		setCnhPreview(driver.src_cnh || null);
		setCrlvPreview(driver.src_crlv || null);
		setCnhFile(null);
		setCrlvFile(null);
		setIsEditing(false);
	};
	useEffect(() => {
		if (isOpen) {
			setCnhPreview(driver.src_cnh || null);
			setCrlvPreview(driver.src_crlv || null);
		}
	}, [isOpen, driver.src_cnh, driver.src_crlv]);
	const DocumentPreview = ({
		src,
		type,
	}: { src: string | null; type: string }) => {
		if (!src) return <p>{type} não disponível</p>;

		return (
			<div className="mt-2">
				<div className="border rounded-md p-2 mt-2 max-w-xs">
					<img
						src={src}
						alt={`${type} do motorista`}
						className="max-h-36 object-contain mx-auto"
					/>
				</div>
			</div>
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild className="">
				<Button variant="ghost" size="icon">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xl ">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Editar Motorista" : "Detalhes do Motorista"}
					</DialogTitle>
					{!isEditing && (
						<Button
							variant="link"
							size="sm"
							className="absolute right-12 top-4"
							onClick={() => setIsEditing(true)}
						>
							<Edit className="h-4 w-4 mr-2" />
						</Button>
					)}
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="">
						<Tabs
							defaultValue="personal"
							className="w-full"
							value={activeTab}
							onValueChange={setActiveTab}
						>
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
								<TabsTrigger value="address">Endereço</TabsTrigger>
								<TabsTrigger value="documents">Documentos</TabsTrigger>
							</TabsList>

							<TabsContent value="personal" className="space-y-4 pt-4">
								<div className="grid grid-cols-2 gap-4">
									{isEditing ? (
										<>
											<FormField
												control={form.control}
												name="name"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel>Nome</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="cpf"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel>CPF</FormLabel>
														<FormControl>
															<Input value={maskCPF(field.value)} disabled />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="email"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel>E-mail</FormLabel>
														<FormControl>
															<Input {...field} type="email" />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="telephone"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel>Telefone</FormLabel>
														<FormControl>
															<Input
																placeholder="(00) 00000-0000"
																value={maskPhone(field.value)}
																onChange={(e) => {
																	const rawValue = e.target.value.replace(
																		/\D/g,
																		"",
																	);
																	if (rawValue.length <= 11)
																		field.onChange(rawValue);
																}}
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
																			format(field.value, "dd/MM/yyyy", {
																				locale: ptBR,
																			})
																		) : (
																			<span>Selecione uma data</span>
																		)}
																		<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																	</Button>
																</FormControl>
															</PopoverTrigger>
															<PopoverContent
																className="w-auto p-0"
																align="start"
															>
																<Calendar
																	mode="single"
																	onSelect={field.onChange}
																	disabled={(date) =>
																		date > new Date() ||
																		date < new Date("1900-01-01")
																	}
																	initialFocus
																	captionLayout="dropdown"
																	fromYear={1900}
																	toYear={new Date().getFullYear()}
																	classNames={{
																		caption_dropdowns: cn(
																			"flex justify-between w-full",
																		),
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
												name="status"
												render={({ field }) => (
													<FormItem className="space-y-2 flex items-end">
														<div className="flex items-center space-x-2">
															<FormLabel>Status</FormLabel>
															<FormControl>
																<Switch
																	checked={field.value === "Ativo"}
																	onCheckedChange={(checked) => {
																		field.onChange(
																			checked ? "Ativo" : "Inativo",
																		);
																	}}
																/>
															</FormControl>
															<span className="text-sm text-muted-foreground">
																{field.value}
															</span>
														</div>
														<FormMessage />
													</FormItem>
												)}
											/>
										</>
									) : (
										<>
											<div>
												<Label className="text-muted-foreground">Nome</Label>
												<p>{driver.name}</p>
											</div>
											<div>
												<Label className="text-muted-foreground">CPF</Label>
												<p>{maskCPF(driver.cpf)}</p>
											</div>
											<div>
												<Label className="text-muted-foreground">E-mail</Label>
												<p>{driver.email}</p>
											</div>
											<div>
												<Label className="text-muted-foreground">
													Telefone
												</Label>
												<p>
													{driver.telephone
														? maskPhone(driver.telephone)
														: "Não informado"}
												</p>
											</div>
											<div>
												<Label className="text-muted-foreground">
													Data de Nascimento
												</Label>
												<p>
													{new Date(driver.date_birth).toLocaleDateString(
														"pt-BR",
													)}
												</p>
											</div>
											<div>
												<Label className="text-muted-foreground">Status</Label>
												<p
													className={
														driver.status === "Ativo"
															? "text-green-500"
															: "text-red-500"
													}
												>
													{driver.status}
												</p>
											</div>
										</>
									)}
								</div>
							</TabsContent>

							<TabsContent value="address" className="space-y-4 pt-4">
								<div className="grid grid-cols-2 gap-4">
									{isEditing ? (
										<>
											<FormField
												control={form.control}
												name="address.street"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel>Rua</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="address.number"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel>Número</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="address.city"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel>Cidade</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="address.state"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel>Estado</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="address.zip_code"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel>CEP</FormLabel>
														<FormControl>
															<Input
																placeholder="12345-678"
																value={applyZipMask(field.value)}
																onChange={(e) => {
																	const rawValue = e.target.value.replace(
																		/\D/g,
																		"",
																	);

																	field.onChange(rawValue);
																}}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</>
									) : (
										<>
											<div>
												<Label className="text-muted-foreground">Rua</Label>
												<p>{driver.address.street}</p>
											</div>
											<div>
												<Label className="text-muted-foreground">Número</Label>
												<p>{driver.address.number}</p>
											</div>
											<div>
												<Label className="text-muted-foreground">Cidade</Label>
												<p>{driver.address.city}</p>
											</div>
											<div>
												<Label className="text-muted-foreground">Estado</Label>
												<p>{driver.address.state}</p>
											</div>
											<div>
												<Label className="text-muted-foreground">CEP</Label>
												<p>{applyZipMask(driver.address.zip_code)}</p>
											</div>
										</>
									)}
								</div>
							</TabsContent>

							<TabsContent value="documents" className="space-y-4 pt-4">
								{/* CNH Document */}
								<FormField
									control={form.control}
									name="src_cnh"
									render={({ field }) => (
										<FormItem className="space-y-2">
											<FormLabel>CNH</FormLabel>
											<FormControl>
												<div className="space-y-4">
													{isEditing ? (
														<>
															<div className="flex items-center gap-4">
																<Input
																	ref={cnhInputRef}
																	id="cnh_upload"
																	type="file"
																	accept="image/*"
																	className="hidden"
																	onChange={(e) => {
																		handleCnhUpload(e);
																	}}
																/>
																<Button
																	type="button"
																	variant="outline"
																	onClick={() => cnhInputRef.current?.click()}
																>
																	<Upload className="h-4 w-4 mr-2" />
																	Selecionar CNH
																</Button>
																{cnhPreview && (
																	<Button
																		type="button"
																		variant="destructive"
																		size="sm"
																		onClick={() => removePreview("cnh")}
																	>
																		<X className="h-4 w-4 mr-1" />
																		Remover
																	</Button>
																)}
															</div>

															{cnhPreview && (
																<div className="relative border rounded-md p-2 max-w-xs">
																	<img
																		src={cnhPreview}
																		alt="Preview CNH"
																		className="max-h-36 object-contain mx-auto"
																	/>
																</div>
															)}
														</>
													) : (
														<DocumentPreview src={driver.src_cnh} type="CNH" />
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
									render={({ field }) => (
										<FormItem className="space-y-2">
											<FormLabel>CRLV</FormLabel>
											<FormControl>
												<div className="space-y-4">
													{isEditing ? (
														<>
															<div className="flex items-center gap-4">
																<Input
																	ref={crlvInputRef}
																	id="crlv_upload"
																	type="file"
																	accept="image/*"
																	className="hidden"
																	onChange={(e) => {
																		handleCrlvUpload(e);
																	}}
																/>
																<Button
																	type="button"
																	variant="outline"
																	onClick={() => crlvInputRef.current?.click()}
																>
																	<Upload className="h-4 w-4 mr-2" />
																	Selecionar CRLV
																</Button>
																{crlvPreview && (
																	<Button
																		type="button"
																		variant="destructive"
																		size="sm"
																		onClick={() => removePreview("crlv")}
																	>
																		<X className="h-4 w-4 mr-1" />
																		Remover
																	</Button>
																)}
															</div>

															{crlvPreview && (
																<div className="relative border rounded-md p-2 max-w-xs">
																	<img
																		src={crlvPreview}
																		alt="Preview CRLV"
																		className="max-h-36 object-contain mx-auto"
																	/>
																</div>
															)}
														</>
													) : (
														<DocumentPreview
															src={driver.src_crlv}
															type="CRLV"
														/>
													)}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</TabsContent>
						</Tabs>

						{isEditing && (
							<>
								<Separator className="my-4" />
								<DialogFooter>
									<Button
										variant="outline"
										onClick={handleCancel}
										disabled={updateDriverMutation.isPending}
										type="button"
									>
										Cancelar
									</Button>
									<Button
										type="submit"
										disabled={updateDriverMutation.isPending}
									>
										{updateDriverMutation.isPending ? (
											<>Salvando...</>
										) : (
											<>
												<Save className="h-4 w-4 mr-2" />
												Salvar
											</>
										)}
									</Button>
								</DialogFooter>
							</>
						)}
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
