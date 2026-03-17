import { Copy, QrCode } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export function SalesPixCard({ onTransactionComplete }) {
	const pixKey = "vendedor@banco.com.br";
	const pixQrCode = "00020126580014br.gov.bcb.pix..."; // Exemplo de QR code PIX

	const handleCopyKey = () => {
		navigator.clipboard.writeText(pixKey);
		alert("Chave PIX copiada!");
	};

	return (
		<Card className="border border-slate-200 bg-white p-6">
			<div className="mb-6">
				<div className="mb-4 flex items-center gap-3">
					<div className="rounded-lg bg-emerald-100 p-3">
						<svg
							className="h-6 w-6 text-emerald-600"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
						</svg>
					</div>
					<div>
						<h3 className="text-lg font-semibold text-slate-900">PIX</h3>
						<p className="text-sm text-slate-500">Transações instantâneas</p>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
					<p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
						Sua chave PIX
					</p>
					<p className="font-mono text-sm text-slate-900">{pixKey}</p>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="mt-3 w-full gap-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
						onClick={handleCopyKey}
					>
						<Copy size={16} />
						Copiar chave PIX
					</Button>
				</div>

				<div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-8">
					<div className="space-y-3 text-center">
						<QrCode size={48} className="mx-auto text-slate-400" />
						<div>
							<p className="text-sm font-medium text-slate-900">QR Code PIX</p>
							<p className="text-xs text-slate-500">Clique para gerar</p>
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="justify-center"
						>
							Gerar QR Code
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
						<p className="text-xs font-medium text-emerald-700">Entradas PIX</p>
						<p className="mt-2 text-2xl font-bold text-emerald-900">R$ 0,00</p>
					</div>
					<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
						<p className="text-xs font-medium text-slate-600">Transações</p>
						<p className="mt-2 text-2xl font-bold text-slate-900">0</p>
					</div>
				</div>
			</div>
		</Card>
	);
}
