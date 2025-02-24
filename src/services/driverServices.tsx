import type { Driver } from "@/lib/validation/driver";

export const updateDriverData = async (data: FormData) => {
	const cpf = data.get("cpf");

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_URL_API}/driver/${cpf}`,
		{
			method: "PATCH",
			body: data,
		},
	);

	if (!response.ok) {
		throw new Error("Erro ao atualizar motorista");
	}

	return response.status;
};

export const getDriver = async (): Promise<Driver[]> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/driver`, {
		method: "GET",
	});

	if (!response.ok) {
		throw new Error("Erro ao buscar motoristas");
	}

	const data = await response.json();
	return data;
};

export const storeDriver = async (completeFormData: FormData) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/driver`, {
		method: "POST",
		body: completeFormData,
	});

	if (!response.ok) {
		const errorData = await response.json();

		if (errorData.code === "P2002") {
			throw new Error("Motorista já cadastrado no sistema");
		}
		throw new Error(errorData.message || "Erro ao cadastrar motorista");
	}

	return await response.status;
};
