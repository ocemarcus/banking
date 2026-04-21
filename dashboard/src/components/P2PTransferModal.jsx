import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createP2PTransaction } from "../api/transactions";
import { getAccountDetail } from "../api/account";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function P2PTransferModal({ isOpen, onClose, accounts, onSuccess }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [searchingAccount, setSearchingAccount] = useState(false);
	const [destinationAccountInfo, setDestinationAccountInfo] = useState(null);
	const debounceTimer = useRef(null);
	const [form, setForm] = useState({
		amount: "",
		accountOriginId: "",
		accountDestinationNumber: "",
	});

	const handleChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setError("");

		// Debounce search for destination account
		if (field === "accountDestinationNumber") {
			setDestinationAccountInfo(null);
			
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}

			if (value && value.trim()) {
				setSearchingAccount(true);
				debounceTimer.current = setTimeout(async () => {
					try {
						const accountData = await getAccountDetail(value);
						setDestinationAccountInfo(accountData);
					} catch (err) {
						setError("Conta não encontrada");
						setDestinationAccountInfo(null);
					} finally {
						setSearchingAccount(false);
					}
				}, 1000);
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.amount || !form.accountOriginId || !destinationAccountInfo?.id) {
			setError("Preencha todos os campos e encontre a conta destino");
			return;
		}

		if (form.accountOriginId === destinationAccountInfo.id) {
			setError("Conta de origem e destino não podem ser iguais");
			return;
		}

		setLoading(true);
		setError("");

		try {
			await createP2PTransaction({
				amount: form.amount,
				accountOriginId: form.accountOriginId,
				accountDestinationId: destinationAccountInfo.id,
			});

			// Reset form and close modal
			setForm({
				amount: "",
				accountOriginId: "",
				accountDestinationNumber: "",
			});
			setDestinationAccountInfo(null);
			onSuccess?.();
			onClose();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Erro ao fazer transferência",
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}
		};
	}, []);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50">
			<Card className="h-full w-80 rounded-none border-l border-r-0">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
					<CardTitle>Transferência P2P</CardTitle>
					<button
						onClick={onClose}
						className="rounded-md p-1 hover:bg-slate-100"
					>
						<X className="h-4 w-4" />
					</button>
				</CardHeader>

				<CardContent className="space-y-4 pt-6">
					{error && (
						<div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="accountOrigin">Conta de Origem</Label>
							<select
								id="accountOrigin"
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								value={form.accountOriginId}
								onChange={(e) =>
									handleChange("accountOriginId", e.target.value)
								}
							>
								<option value="">Selecionar conta...</option>
								{accounts.map((acc) => (
									<option key={acc.id} value={acc.id}>
										{acc.document} - {acc.type.toUpperCase()} - R${" "}
										{Number(acc.balance).toLocaleString("pt-BR", {
											minimumFractionDigits: 2,
										})}
									</option>
								))}
							</select>
						</div>

						<div className="space-y-2">
						<Label htmlFor="accountDestination">Conta de Destino</Label>
						<Input
							id="accountDestination"
							type="text"
							placeholder="Digite o número da conta"
							value={form.accountDestinationNumber}
							onChange={(e) =>
								handleChange("accountDestinationNumber", e.target.value)
							}
							disabled={loading}
						/>
						{searchingAccount && (
							<p className="text-sm text-slate-500">Buscando conta...</p>
						)}
						{destinationAccountInfo && (
							<div className="rounded-md bg-green-50 p-3 text-sm space-y-1">
								<p className="text-green-900 font-medium">
									{destinationAccountInfo.user?.fullName}
								</p>
								<p className="text-green-800 text-xs">
									Documento: {destinationAccountInfo.user?.document}
								</p>
								<p className="text-green-800 text-xs">
									Telefone: {destinationAccountInfo.user?.cellPhone}
								</p>
							</div>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="amount">Valor (R$)</Label>
						<Input
							id="amount"
							type="number"
							step="0.01"
							min="0"
							placeholder="0,00"
							value={form.amount}
							onChange={(e) => handleChange("amount", e.target.value)}
							required
						/>
					</div>

						<div className="flex gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								className="flex-1"
								onClick={onClose}
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								className="flex-1"
								disabled={loading || !destinationAccountInfo}
							>
								{loading ? "Processando..." : "Transferir"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
