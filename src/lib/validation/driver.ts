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
			.transform((date) => date.toISOString().split("T")[0]) // Transforma Date em string YYYY-MM-DD
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
			.any()
			.refine(
				(file) => file[0]?.size <= MAX_FILE_SIZE,
				"Arquivo deve ter no máximo 5MB",
			)
			.refine(
				(file) => ACCEPTED_FILE_TYPES.includes(file[0].type),
				"Formato de arquivo inválido. Por favor, selecione uma imagem nos formatos PNG, JPEG, JPG.",
			),
		src_crlv: z
			.any()
			.refine(
				(file) => file[0]?.size <= MAX_FILE_SIZE,
				"Arquivo deve ter no máximo 5MB",
			)
			.refine(
				(file) => ACCEPTED_FILE_TYPES.includes(file[0]?.type),
				"Formato de arquivo inválido. Por favor, selecione uma imagem nos formatos PNG, JPEG, JPG.",
			),
	}),
});

export type DriverFormData = z.infer<typeof driverSchema>;
