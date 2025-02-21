import { z } from "zod";
import { isAdult } from "../utils";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const driverSchema = z.object({
	personalInfo: z.object({
		name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
		email: z.string().email("Email inválido"),
		cpf: z.string().regex(/^\d{11}$/, "CPF inválido"),
		phone: z.string().regex(/^\d{11}$/, "Telefone inválido"),
		date_birth: z
			.date({
				required_error: "Data de nascimento é obrigatória",
				invalid_type_error: "Data de nascimento inválida",
			})
			.refine((date) => date <= new Date(), {
				message: "Data deve ser no máximo a data de hoje",
			})
			.refine((date) => date >= new Date("1900-01-01"), {
				message: "Data deve estar entre 01/01/1900 e hoje",
			})
			.refine((dateStr) => isAdult, {
				message: "Motorista deve ter pelo menos 18 anos",
			})
			.transform((date) => date.toISOString().split("T")[0])
			.optional(),
	}),

	address: z.object({
		street: z.string().min(3, "Rua é obrigatória"),
		number: z.string().min(1, "Número é obrigatório"),
		city: z.string().min(2, "Cidade é obrigatória"),
		state: z.string().length(2, "Estado deve ter 2 caracteres"),
		zip_code: z.string().regex(/^\d{8}$/, "CEP inválido"),
	}),
	documents: z.object({
		src_cnh: z
			.instanceof(FileList)
			.refine((files) => files.length > 0, {
				message: "CNH é obrigatória",
			})
			.refine(
				(files) => {
					const file = files[0];
					const validTypes = ["image/jpeg", "image/png", "application/pdf"];
					return validTypes.includes(file.type);
				},
				{
					message: "Arquivo deve ser JPG, PNG ou PDF",
				},
			)
			.refine(
				(files) => {
					const file = files[0];
					return file.size <= 5 * 1024 * 1024; // 5MB
				},
				{
					message: "O arquivo deve ter no máximo 5MB",
				},
			),
		src_crlv: z
			.instanceof(FileList)
			.refine((files) => files.length > 0, {
				message: "CRLV é obrigatório",
			})
			.refine(
				(files) => {
					const file = files[0];
					const validTypes = ["image/jpeg", "image/png", "application/pdf"];
					return validTypes.includes(file.type);
				},
				{
					message: "Arquivo deve ser JPG, PNG ou PDF",
				},
			)
			.refine(
				(files) => {
					const file = files[0];
					return file.size <= 5 * 1024 * 1024; // 5MB
				},
				{
					message: "O arquivo deve ter no máximo 5MB",
				},
			),
	}),
});

export const driverFormSchemaUpdated = z.object({
	name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
	email: z.string().email("Email inválido"),
	cpf: z.string().regex(/^\d{11}$/, "CPF inválido"),
	telephone: z.string().regex(/^\d{11}$/, "Telefone inválido"),
	date_birth: z
		.string({
			required_error: "Data de nascimento é obrigatória",
			invalid_type_error: "Data de nascimento inválida",
		})
		.refine(
			(dateStr) => {
				const date = new Date(dateStr);
				return date <= new Date() && date >= new Date("1900-01-01");
			},
			{
				message: "Data deve estar entre 01/01/1900 e hoje",
			},
		)
		.refine(isAdult, {
			message: "Motorista deve ter pelo menos 18 anos",
		}),
	status: z.enum(["Ativo", "Inativo"]),
	address: z.object({
		street: z.string().min(1, "Rua é obrigatória"),
		number: z.string().min(1, "Número é obrigatório"),
		city: z.string().min(1, "Cidade é obrigatória"),
		state: z.string().min(1, "Estado é obrigatório"),
		zip_code: z.string().min(1, "CEP é obrigatório"),
	}),
	src_cnh: z
		.any()
		.refine(
			(file) => !file || (file.length > 0 && file[0].size <= MAX_FILE_SIZE),
			"Arquivo deve ter no máximo 5MB",
		)
		.refine(
			(file) =>
				!file ||
				(file.length > 0 && ACCEPTED_FILE_TYPES.includes(file[0].type)),
			"Formato de arquivo inválido. Por favor, selecione uma imagem nos formatos PNG, JPEG, JPG.",
		)
		.optional(),
	src_crlv: z
		.any()
		.refine(
			(file) => !file || (file.length > 0 && file[0].size <= MAX_FILE_SIZE),
			"Arquivo deve ter no máximo 5MB",
		)
		.refine(
			(file) =>
				!file ||
				(file.length > 0 && ACCEPTED_FILE_TYPES.includes(file[0].type)),
			"Formato de arquivo inválido. Por favor, selecione uma imagem nos formatos PNG, JPEG, JPG.",
		)
		.optional(),
});

export const enhancedDocumentSchema = z.object({
	src_cnh: z
		.instanceof(FileList)
		.refine((files) => files.length > 0, {
			message: "CNH é obrigatória",
		})
		.refine(
			(files) => {
				const file = files[0];
				const validTypes = ["image/jpeg", "image/png", "application/pdf"];
				return validTypes.includes(file.type);
			},
			{
				message: "Arquivo deve ser JPG, PNG ou PDF",
			},
		)
		.refine(
			(files) => {
				const file = files[0];
				return file.size <= 5 * 1024 * 1024; // 5MB
			},
			{
				message: "O arquivo deve ter no máximo 5MB",
			},
		),
	src_crlv: z
		.instanceof(FileList)
		.refine((files) => files.length > 0, {
			message: "CRLV é obrigatório",
		})
		.refine(
			(files) => {
				const file = files[0];
				const validTypes = ["image/jpeg", "image/png", "application/pdf"];
				return validTypes.includes(file.type);
			},
			{
				message: "Arquivo deve ser JPG, PNG ou PDF",
			},
		)
		.refine(
			(files) => {
				const file = files[0];
				return file.size <= 5 * 1024 * 1024; // 5MB
			},
			{
				message: "O arquivo deve ter no máximo 5MB",
			},
		),
});
export type DriverFormData = z.infer<typeof driverSchema>;
export type Driver = {
	cpf: string;
	name: string;
	date_birth: string;
	status: "Ativo" | "Inativo";
	email: string;
	src_cnh: string;
	src_crlv: string;
	address: {
		number: string;
		street: string;
		city: string;
		state: string;
		zip_code: string;
	};
	telephone?: string | undefined;
};
