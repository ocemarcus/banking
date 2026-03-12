import { useMemo, useState } from "react";
import { P2PTransferModal } from "../../components/P2PTransferModal";
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

export function TransactionsPage({
		transactions,
		page,
		total,
		loading,
		error,
		filters,
		onFiltersChange,
		onPageChange,
		accounts = [],
		onTransferSuccess,
	}) {
		const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
		const totalPages = useMemo(() => {
			if (!transactions.length) return 1;
			const pageSize = transactions.length || 1;
			return Math.max(1, Math.ceil(total / pageSize));
		}, [transactions, total]);

		return (
			<section className="space-y-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0">
						<div>
							<CardTitle>Filtros de transações</CardTitle>
							<CardDescription>
								Filtre por período e tipo de transação
							</CardDescription>
						</div>
						<Button
							onClick={() => setIsTransferModalOpen(true)}
							className="ml-auto"
						>
							+ Transferência
						</Button>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
							<div className="space-y-2">
								<Label htmlFor="startDate">Data Inicial</Label>
								<Input
									id="startDate"
									type="date"
									value={filters.startDate}
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
									value={filters.endDate}
									onChange={(event) =>
										onFiltersChange("endDate", event.target.value)
									}
								/>
							</div>
							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="typeTransaction">Tipo de transação</Label>
								<select
									id="typeTransaction"
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									value={filters.typeTransaction}
									onChange={(event) =>
										onFiltersChange("typeTransaction", event.target.value)
									}
								>
									<option value="">Todas</option>
									<option value="pixIn">Entrada Pix</option>
									<option value="bankSplitIn">Entrada Boleto</option>
									<option value="transferInternalIn">
										Transferência interna
									</option>
									<option value="transferInternalOut">
										Transferência entre contas
									</option>
								</select>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Transações</CardTitle>
						<CardDescription>Listagem de transações da conta</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{error && <div className="text-sm text-red-600">{error}</div>}
						<div className="overflow-x-auto">
							<table className="w-full min-w-[720px] text-left text-sm">
								<thead>
									<tr className="border-b text-muted-foreground">
										<th className="pb-3">Data</th>
										<th className="pb-3">Tipo</th>
										<th className="pb-3">Origem</th>
										<th className="pb-3">Destino</th>
										<th className="pb-3 text-right">Valor</th>
									</tr>
								</thead>
								<tbody>
									{transactions.length === 0 && !loading && (
										<tr>
											<td
												colSpan={5}
												className="py-4 text-center text-sm text-slate-500"
											>
												Nenhuma transação encontrada para os filtros
												selecionados.
											</td>
										</tr>
									)}
									{transactions.map((tx) => (
										<tr key={tx.id} className="border-b last:border-0">
											<td className="py-3 text-slate-700">
												{tx.createdAt
													? new Date(tx.createdAt).toLocaleString("pt-BR")
													: ""}
											</td>
											<td className="py-3 text-slate-500">{tx.typeLabel}</td>
											<td className="py-3">
												<div className="text-xs text-slate-500">De:</div>
												<div className="text-sm font-medium text-slate-700">
													{tx.debit?.fullName || "-"}
												</div>
												<div className="text-xs text-slate-500">
													{tx.debit?.bankName} • {tx.debit?.bankAccount}
												</div>
											</td>
											<td className="py-3">
												<div className="text-xs text-slate-500">Para:</div>
												<div className="text-sm font-medium text-slate-700">
													{tx.credit?.fullName || "-"}
												</div>
												<div className="text-xs text-slate-500">
													{tx.credit?.bankName} • {tx.credit?.bankAccount}
												</div>
											</td>
											<td className="py-3 text-right font-semibold text-slate-700">
												R${" "}
												{Number(tx.amount).toLocaleString("pt-BR", {
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

				<P2PTransferModal
					isOpen={isTransferModalOpen}
					onClose={() => setIsTransferModalOpen(false)}
					accounts={accounts}
					onSuccess={onTransferSuccess}
				/>
			</section>
		);
	}
