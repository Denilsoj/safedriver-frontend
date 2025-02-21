"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { maskCPF } from "@/lib/utils";
import DriverDetailsModal from "./DriverDatailsModal";
import { ArrowUpDown, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Driver } from "@/lib/validation/driver";

export const columns: ColumnDef<Driver>[] = [
	{
		accessorKey: "cpf",
		header: ({ column }) => {
			return (
				<div className="text-center">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						CPF
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const amount: string = row.getValue("cpf");
			const formatted = maskCPF(amount);
			return <div className="text-center">{formatted}</div>;
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<div className="text-center">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Name
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const amount: string = row.getValue("name");
			return <div className="text-center">{amount}</div>;
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<div className="text-center">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Email
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const amount: string = row.getValue("email");
			return <div className="text-center">{amount}</div>;
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<div className="text-center">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Status
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const amount: string = row.getValue("status");
			return (
				<div className="flex justify-center">
					{amount === "Ativo" ? (
						<UserCheck className="text-green-600" />
					) : (
						<UserX className="text-red-500" />
					)}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const driver = row.original;

			return (
				<div className="flex justify-end pl-3">
					<DriverDetailsModal driver={driver} />
				</div>
			);
		},
	},
];
