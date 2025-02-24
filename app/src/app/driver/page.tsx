"use client";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./dataTable";
import { columns } from "./columns";
import { getDriver } from "@/services/driverServices";

export default function DriverPage() {
	const {
		data: drivers = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["drivers"],
		queryFn: getDriver,
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: true,
	});

	return (
		<div>
			<header className="bg-slate-100 h-24 flex items-center justify-between px-11">
				{isError && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
						Erro ao carregar motoristas: {error.message}
					</div>
				)}
			</header>
			<main>
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
					</div>
				) : (
					<DataTable columns={columns} data={drivers} />
				)}
			</main>
		</div>
	);
}
