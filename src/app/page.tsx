import { Button } from "@/components/ui/button";
import { Shield, Truck, Clock, ChartBar, FileCheck } from "lucide-react";

import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen overflow-y-">
			<div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-8 lg:py-16 px-4 lg:px-8">
				<div className="flex-1 space-y-4 lg:space-y-6 text-center lg:text-left">
					<h1 className="text-3xl md:text-2xl lg:text-5xl font-bold text-[#4A148C] leading-tight">
						Tecnologia e experiência aliadas para sua tranquilidade
					</h1>
					<p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
						Temos um conjunto personalizado de soluções em Gestão de Riscos para
						ajudá-lo a conquistar mais segurança em todas as etapas de sua
						operação, desde as contratações de motoristas até a confirmação das
						entregas de suas cargas.
					</p>
					<Link href="/driver/register" className="inline-block">
						<Button className="bg-[#4A148C] hover:bg-[#6A1B9A] text-white px-6 lg:px-8 py-4 lg:py-6 text-base lg:text-lg w-full sm:w-auto">
							Vamos conversar sobre sua operação
						</Button>
					</Link>
				</div>
				<div className="flex-1 relative mt-8 lg:mt-0">
					<div className="bg-[#40E0D0] rounded-full w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] relative overflow-hidden mx-auto">
						<img
							src="https://images.unsplash.com/photo-1560250097-0b93528c311a"
							alt="Professional with crossed arms"
							className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-[400px] -translate-y-1/2  object-cover"
						/>
					</div>

					<div className="hidden md:block">
						<div className="absolute top-0 right-0 animate-bounce">
							<Shield className="w-8 h-8 lg:w-12 lg:h-12 text-[#4A148C]" />
						</div>
						<div className="absolute bottom-0 left-0 animate-bounce">
							<Truck className="w-8 h-8 lg:w-12 lg:h-12 text-[#4A148C]" />
						</div>
						<div className="absolute top-1/2 right-0 animate-bounce">
							<Clock className="w-8 h-8 lg:w-12 lg:h-12 text-[#4A148C]" />
						</div>
						<div className="absolute top-1/4 left-0 animate-bounce">
							<ChartBar className="w-8 h-8 lg:w-12 lg:h-12 text-[#4A148C]" />
						</div>
						<div className="absolute bottom-1/4 right-0 animate-bounce">
							<FileCheck className="w-8 h-8 lg:w-12 lg:h-12 text-[#4A148C]" />
						</div>
					</div>
				</div>
			</div>

			<div className="bg-[#4A148C] text-white py-12 lg:py-16 mt-5 lg:mt-12 px-4">
				<div className="container mx-auto text-center">
					<h2 className="text-2xl lg:text-3xl font-bold mb-8 lg:mb-12">
						Somos homologados por todas as companhias de seguro
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-8 items-center justify-items-center opacity-70">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={i}
								className="bg-white w-full max-w-[120px] lg:w-32 h-10 lg:h-12 rounded flex items-center justify-center"
							>
								Logo {i}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
