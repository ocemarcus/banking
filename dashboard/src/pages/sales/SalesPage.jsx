import { useMemo } from "react";
import { Button } from "../../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function SalesPage({
	sales = [],
	page = 1,
	total = 0,
	loading = false,
	error = "",
	filters = {},
	onFiltersChange = () => {},
	onPageChange = () => {},
}) {
	const totalPages = useMemo(() => {
		if (!sales.length) return 1;
		const pageSize = sales.length || 1;
		return Math.max(1, Math.ceil(total / pageSize));
	}, [sales, total]);

	const totals = useMemo(() => {
		return sales.reduce(
			(acc, sale) => {
				acc.total += sale.amount || 0;
				acc.count += 1;
				return acc;
			},
			{ total: 0, count: 0 }
		);
	}, [sales]);

	return (
		<section className="space-y-4">
			{/* Summary Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-slate-600">
							Total de Vendas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-slate-900">
							R$ {totals.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
						</div>
						<p className="text-xs text-slate-500 mt-1">Todas as modalidades</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-slate-600">
							Quantidade de Vendas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-slate-900">
							{totals.count}
						</div>
						<p className="text-xs text-slate-500 mt-1">PIX + Cartão</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-slate-600">
							Ticket Médio
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-slate-900">
							R$ {(totals.count > 0 ? totals.total / totals.count : 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
						</div>
						<p className="text-xs text-slate-500 mt-1">Por transação</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Filtros de vendas</CardTitle>
					<CardDescription>
						Filtre por período e método de pagamento
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
						<div className="space-y-2">
							<Label htmlFor="startDate">Data Inicial</Label>
							<Input
								id="startDate"
								type="date"
								value={filters.startDate || ""}
								onChange={(event) =>
									onFiltersChange("startDate", event.target.value)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="endDate">Data Final</Label>
							<Input
								id="endDate"
								type="date"
								value={filters.endDate || ""}
								onChange={(event) =>
									onFiltersChange("endDate", event.target.value)
								}
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="paymentMethod">Método de Pagamento</Label>
							<select
								id="paymentMethod"
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								value={filters.paymentMethod || ""}
								onChange={(event) =>
									onFiltersChange("paymentMethod", event.target.value)
								}
							>
								<option value="">Todos</option>
								<option value="pix">PIX</option>
								<option value="credit">Cartão Crédito</option>
								<option value="debit">Cartão Débito</option>
							</select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Sales Table */}
			<Card>
				<CardHeader>
					<CardTitle>Vendas</CardTitle>
					<CardDescription>Listagem de todas as vendas</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && <div className="text-sm text-red-600">{error}</div>}
					<div className="overflow-x-auto">
						<table className="w-full min-w-[720px] text-left text-sm">
							<thead>
								<tr className="border-b text-muted-foreground">
									<th className="pb-3">Data</th>
									<th className="pb-3">Método</th>
									<th className="pb-3">Bandeira/Tipo</th>
									<th className="pb-3">Descrição</th>
									<th className="pb-3 text-right">Valor</th>
								</tr>
							</thead>
							<tbody>
								{sales.length === 0 && !loading && (
									<tr>
										<td
											colSpan={5}
											className="py-4 text-center text-sm text-slate-500"
										>
											Nenhuma venda encontrada para os filtros selecionados.
										</td>
									</tr>
								)}
								{sales.map((sale) => (
									<tr key={sale.id} className="border-b last:border-0">
										<td className="py-3 text-slate-700">
											{sale.date
												? new Date(sale.date).toLocaleString("pt-BR")
												: "-"}
										</td>
										<td className="py-3">
											<span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
												sale.paymentMethod === "pix"
													? "bg-emerald-100 text-emerald-700"
													: sale.paymentMethod === "credit"
													? "bg-blue-100 text-blue-700"
													: "bg-purple-100 text-purple-700"
											}`}>
												{sale.paymentMethod === "pix"
													? "PIX"
													: sale.paymentMethod === "credit"
													? "Crédito"
													: "Débito"}
											</span>
										</td>
										<td className="py-3 text-slate-700">
											{sale.brand || "-"}
										</td>
										<td className="py-3 text-slate-700">
											{sale.description || "-"}
										</td>
										<td className="py-3 text-right font-semibold text-slate-700">
											R${" "}
											{Number(sale.amount || 0).toLocaleString("pt-BR", {
												minimumFractionDigits: 2,
											})}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
						<div className="text-slate-500">
							Página{" "}
							<span className="font-semibold text-slate-700">{page}</span> de{" "}
							<span className="font-semibold text-slate-700">
								{totalPages}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={page <= 1 || loading}
								onClick={() => onPageChange(page - 1)}
							>
								Anterior
							</Button>
							<Button
								variant="outline"
								size="sm"
								disabled={page >= totalPages || loading}
								onClick={() => onPageChange(page + 1)}
							>
								Próxima
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
