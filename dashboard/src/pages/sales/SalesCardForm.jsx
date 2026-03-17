import { useState } from "react";
import { Card } from "../../components/ui/card";

const CARD_BRANDS = [
	{ id: "visa", name: "Visa", color: "bg-blue-600" },
	{ id: "mastercard", name: "Mastercard", color: "bg-red-600" },
	{ id: "elo", name: "Elo", color: "bg-amber-500" },
	{ id: "amex", name: "American Express", color: "bg-blue-400" },
	{ id: "cabal", name: "Cabal", color: "bg-purple-600" },
];

export function SalesCardForm() {
	const [cardType, setCardType] = useState("credit");
	const [selectedBrand, setSelectedBrand] = useState("visa");
	const [creditTotal, setCreditTotal] = useState("0.00");
	const [debitTotal, setDebitTotal] = useState("0.00");

	const cardStats = {
		credit: {
			total: creditTotal,
			transactions: 0,
			avgValue: 0,
		},
		debit: {
			total: debitTotal,
			transactions: 0,
			avgValue: 0,
		},
	};

	return (
		<Card className="border border-slate-200 bg-white p-6">
			<div className="mb-6">
				<div className="mb-4 flex items-center gap-3">
					<div className="rounded-lg bg-blue-100 p-3">
						<svg
							className="h-6 w-6 text-blue-600"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M20 8H4V4h16m0 12H4c-1.1 0-2 .9-2 2v4h20v-4c0-1.1-.9-2-2-2zm-2 5h-4v2h4v-2z" />
						</svg>
					</div>
					<div>
						<h3 className="text-lg font-semibold text-slate-900">Cartão</h3>
						<p className="text-sm text-slate-500">Crédito e Débito</p>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				{/* Card Type Selection */}
				<div>
					<label className="mb-3 block text-sm font-medium text-slate-700">
						Tipo de Cartão
					</label>
					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => setCardType("credit")}
							className={`flex-1 rounded-lg border-2 px-4 py-2 font-medium transition ${
								cardType === "credit"
									? "border-blue-500 bg-blue-50 text-blue-700"
									: "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
							}`}
						>
							Crédito
						</button>
						<button
							type="button"
							onClick={() => setCardType("debit")}
							className={`flex-1 rounded-lg border-2 px-4 py-2 font-medium transition ${
								cardType === "debit"
									? "border-blue-500 bg-blue-50 text-blue-700"
									: "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
							}`}
						>
							Débito
						</button>
					</div>
				</div>

				{/* Card Brands */}
				<div>
					<label className="mb-3 block text-sm font-medium text-slate-700">
						Bandeiras
					</label>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
						{CARD_BRANDS.map((brand) => (
							<button
								key={brand.id}
								type="button"
								onClick={() => setSelectedBrand(brand.id)}
								className={`rounded-lg border-2 px-3 py-3 text-center text-xs font-semibold transition ${
									selectedBrand === brand.id
										? "border-slate-900 bg-slate-50"
										: "border-slate-200 bg-white hover:border-slate-300"
								}`}
							>
								<div className={`${brand.color} mx-auto mb-2 h-6 w-12 rounded`} />
								<span className="text-slate-700">{brand.name}</span>
							</button>
						))}
					</div>
				</div>

				{/* Statistics */}
				<div className="space-y-4">
					<h4 className="text-sm font-semibold text-slate-900">
						Resumo de Vendas - {cardType === "credit" ? "Crédito" : "Débito"}
					</h4>

					<div className="grid grid-cols-3 gap-3">
						<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
							<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
								Total
							</p>
							<p className="mt-2 text-xl font-bold text-slate-900">
								R$ {cardStats[cardType].total}
							</p>
						</div>

						<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
							<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
								Transações
							</p>
							<p className="mt-2 text-xl font-bold text-slate-900">
								{cardStats[cardType].transactions}
							</p>
						</div>

						<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
							<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
								Ticket Médio
							</p>
							<p className="mt-2 text-xl font-bold text-slate-900">
								R$ {cardStats[cardType].avgValue.toFixed(2)}
							</p>
						</div>
					</div>
				</div>

				{/* Card Details */}
				<div className="space-y-3">
					<h4 className="text-sm font-semibold text-slate-900">Detalhes do Cartão</h4>

					<div className="flex h-40 items-end rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 p-6 text-white">
						<div className="w-full space-y-4">
							<div>
								<p className="text-xs opacity-75">Número do cartão</p>
								<p className="font-mono text-lg">•••• •••• •••• 1234</p>
							</div>
							<div className="flex justify-between">
								<div>
									<p className="text-xs opacity-75">Válido até</p>
									<p className="font-mono font-semibold">12/26</p>
								</div>
								<div className="text-right">
									<p className="text-xs opacity-75">CVV</p>
									<p className="font-mono font-semibold">•••</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
