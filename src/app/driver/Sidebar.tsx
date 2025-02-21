"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Settings, Users, BarChart3, Menu, Truck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarItems = [
	{ name: "Dashboard", href: "/", icon: Home },
	{ name: "Motoristas", href: "/driver", icon: Truck },
	{ name: "Cadastre-se", href: "/driver/register", icon: Users },
];

export function Sidebar() {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div
			className={cn(
				"relative border-r bg-card min-h-screen transition-all duration-150 bg-slate-100 max-sm:",
				isCollapsed ? "w-11" : "w-72",
			)}
		>
			<div className="p-4 flex justify-between items-center">
				<h2
					className={cn(
						"font-semibold tracking-tight transition-all duration-150",
						isCollapsed ? "opacity-0 invisible" : "opacity-100 visible",
					)}
				>
					<img
						src="../../../logo.png"
						alt=""
						className="max-w-24 max-sm:w-16"
					/>
				</h2>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="absolute  right-0"
				>
					<Menu className="h-4 w-4" />
				</Button>
			</div>
			<ScrollArea className="h-[calc(100vh-5rem)]">
				<div className="space-y-2 py-2">
					{sidebarItems.map((item) => (
						<Link key={item.href} href={item.href}>
							<Button
								variant={pathname === item.href ? "secondary" : "ghost"}
								className={cn(
									"w-full justify-start",
									isCollapsed ? "px-2" : "px-4",
								)}
							>
								<item.icon
									className={cn("h-4 w-4", isCollapsed ? "mx-0" : "mr-2")}
								/>
								<span
									className={cn(
										"transition-all duration-300",
										isCollapsed
											? "opacity-0 invisible w-0"
											: "opacity-100 visible",
									)}
								>
									{item.name}
								</span>
							</Button>
						</Link>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
