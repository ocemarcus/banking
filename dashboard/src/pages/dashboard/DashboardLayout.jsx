import {
	ArrowDownCircle,
	CreditCard,
	LayoutDashboard,
	Settings,
	ShoppingCart,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { createAccount, getAccount } from "../../api/account";
import { getTransactions } from "../../api/transactions";
import { Button } from "../../components/ui/button";
import { AccountPage } from "../accounts/AccountPage";
import { SalesPage } from "../sales/SalesPage";
import { TransactionsPage } from "../transactions/TransactionsPage";
import { OverviewPage } from "./OverviewPage";

export function DashboardLayout({ user, onLogout }) {
	const [activePage, setActivePage] = useState("dashboard");
	const [accounts, setAccounts] = useState([]);
	const [accountForm, setAccountForm] = useState({
		accountType: "pf",
		document: "",
	});
	const [loadingAccounts, setLoadingAccounts] = useState(false);
	const [errorAccounts, setErrorAccounts] = useState("");
	const [transactions, setTransactions] = useState([]);
	const [transactionsPage, setTransactionsPage] = useState(1);
	const [transactionsTotal, setTransactionsTotal] = useState(0);
	const [loadingTransactions, setLoadingTransactions] = useState(false);
	const [errorTransactions, setErrorTransactions] = useState("");
	const [transactionsFilters, setTransactionsFilters] = useState({
		startDate: "",
		endDate: "",
		typeTransaction: "",
	});
	const [sales, setSales] = useState([]);
	const [salesPage, setSalesPage] = useState(1);
	const [salesTotal, setSalesTotal] = useState(0);
	const [loadingSales, setLoadingSales] = useState(false);
	const [errorSales, setErrorSales] = useState("");
	const [salesFilters, setSalesFilters] = useState({
		startDate: "",
		endDate: "",
		paymentMethod: "",
	});

	const initialTransactions = [
		{
			id: "TRX-001",
			type: "Entrada",
			description: "Salário",
			amount: 5800,
			date: "2026-03-05",
		},
		{
			id: "TRX-002",
			type: "Saída",
			description: "Aluguel",
			amount: 1800,
			date: "2026-03-03",
		},
		{
			id: "TRX-003",
			type: "Saída",
			description: "Supermercado",
			amount: 420,
			date: "2026-03-02",
		},
		{
			id: "TRX-004",
			type: "Entrada",
			description: "Freelance",
			amount: 1100,
			date: "2026-03-01",
		},
		{
			id: "TRX-005",
			type: "Saída",
			description: "Energia",
			amount: 260,
			date: "2026-02-28",
		},
	];

	const totals = useMemo(
		() =>
			initialTransactions.reduce(
				(acc, tx) => {
					if (tx.type === "Entrada") acc.entradas += tx.amount;
					if (tx.type === "Saída") acc.saidas += tx.amount;
					return acc;
				},
				{ entradas: 0, saidas: 0 },
			),
		[],
	);

	const userInitials = useMemo(() => {
		if (!user?.email) return "U";
		const [name] = user.email.split("@");
		if (!name) return "U";
		const parts = name.split(/[.\s_-]/).filter(Boolean);
		if (!parts.length) return name.charAt(0).toUpperCase();
		const first = parts[0].charAt(0) || "";
		const last = parts[parts.length - 1].charAt(0) || "";
		return (first + (parts.length > 1 ? last : "")).toUpperCase();
	}, [user]);

	React.useEffect(() => {
		if (activePage !== "account") return;
		setLoadingAccounts(true);
		setErrorAccounts("");
		getAccount()
			.then((res) => {
				const apiAccounts = Array.isArray(res?.data) ? res.data : [];
				const mappedAccounts = apiAccounts.map((item) => ({
					id: item.id,
					document: item.accountNumber,
					type: item.accountType,
					balance: item.balance ?? 0,
				}));
				setAccounts(mappedAccounts);
			})
			.catch((err) => {
				setErrorAccounts(
					err instanceof Error ? err.message : "Erro ao buscar contas",
				);
			})
			.finally(() => setLoadingAccounts(false));
	}, [activePage]);

	React.useEffect(() => {
		if (activePage !== "transactions") return;

		setLoadingTransactions(true);
		setErrorTransactions("");

		getTransactions({
			page: transactionsPage,
			startDate: transactionsFilters.startDate || undefined,
			endDate: transactionsFilters.endDate || undefined,
			typeTransaction: transactionsFilters.typeTransaction || undefined,
		})
			.then((res) => {
				const apiTransactions = Array.isArray(res?.data) ? res.data : [];
				const pageFromApi =
					typeof res?.page === "number" ? res.page : transactionsPage;
				const totalFromApi =
					typeof res?.total === "number" ? res.total : apiTransactions.length;

				const mapped = apiTransactions.map((item) => ({
					id: item.id,
					amount: item.amount,
					credit: item.credit,
					debit: item.debit,
					createdAt: item.createdAt,
					updatedAt: item.updatedAt,
					type: item.typeTransaction,
					typeLabel:
						item.typeTransaction === "pixIn"
							? "Entrada Pix"
							: item.typeTransaction === "bankSplitIn"
								? "Entrada Boleto"
								: item.typeTransaction === "transferInternalIn"
									? "Transferência interna"
									: item.typeTransaction === "transferInternalOut"
										? "Transferência entre contas"
										: "Transação",
				}));

				setTransactions(mapped);
				setTransactionsPage(pageFromApi);
				setTransactionsTotal(totalFromApi);
			})
			.catch((err) => {
				setErrorTransactions(
					err instanceof Error ? err.message : "Erro ao buscar transações",
				);
			})
			.finally(() => setLoadingTransactions(false));
	}, [activePage, transactionsPage, transactionsFilters]);

	React.useEffect(() => {
		if (activePage !== "sales") return;

		setLoadingSales(true);
		setErrorSales("");

		// Simulando dados de vendas - futuramente integrar com API
		const mockSales = [
			{
				id: "SALE-001",
				date: "2026-03-14",
				paymentMethod: "pix",
				brand: "PIX",
				description: "Venda - Produto A",
				amount: 150.00,
			},
			{
				id: "SALE-002",
				date: "2026-03-13",
				paymentMethod: "credit",
				brand: "Visa",
				description: "Venda - Produto B",
				amount: 320.50,
			},
			{
				id: "SALE-003",
				date: "2026-03-13",
				paymentMethod: "debit",
				brand: "Mastercard",
				description: "Venda - Produto C",
				amount: 89.90,
			},
			{
				id: "SALE-004",
				date: "2026-03-12",
				paymentMethod: "pix",
				brand: "PIX",
				description: "Venda - Produto D",
				amount: 450.00,
			},
			{
				id: "SALE-005",
				date: "2026-03-12",
				paymentMethod: "credit",
				brand: "Elo",
				description: "Venda - Produto E",
				amount: 200.00,
			},
		];

		setTimeout(() => {
			// Aplicar filtros
			let filtered = [...mockSales];
			
			if (salesFilters.paymentMethod) {
				filtered = filtered.filter(
					(sale) => sale.paymentMethod === salesFilters.paymentMethod
				);
			}

			if (salesFilters.startDate) {
				const startDate = new Date(salesFilters.startDate);
				filtered = filtered.filter(
					(sale) => new Date(sale.date) >= startDate
				);
			}

			if (salesFilters.endDate) {
				const endDate = new Date(salesFilters.endDate);
				endDate.setHours(23, 59, 59, 999);
				filtered = filtered.filter(
					(sale) => new Date(sale.date) <= endDate
				);
			}

			setSales(filtered);
			setSalesTotal(filtered.length);
			setSalesPage(1);
			setLoadingSales(false);
		}, 500);
	}, [activePage, salesPage, salesFilters]);

	async function handleCreateAccount(event) {
		event.preventDefault();
		if (!accountForm.document) return;

		try {
			setLoadingAccounts(true);
			setErrorAccounts("");

			await createAccount({
				accountType: accountForm.accountType,
				document: accountForm.document,
			});

			const res = await getAccount();
			const apiAccounts = Array.isArray(res?.data) ? res.data : [];
			const mappedAccounts = apiAccounts.map((item) => ({
				id: item.id,
				document: item.accountNumber,
				type: item.accountType,
				balance: item.balance ?? 0,
			}));
			setAccounts(mappedAccounts);
			setAccountForm({ accountType: "pf", document: "" });
		} catch (err) {
			setErrorAccounts(
				err instanceof Error ? err.message : "Erro ao criar conta",
			);
		} finally {
			setLoadingAccounts(false);
		}
	}

	function renderPage() {
		if (activePage === "account") {
			return (
				<>
					{loadingAccounts && <div className="p-4">Carregando contas...</div>}
					{errorAccounts && (
						<div className="p-4 text-red-600">{errorAccounts}</div>
					)}
					<AccountPage
						accounts={accounts}
						accountForm={accountForm}
						onFormChange={(key, value) =>
							setAccountForm((prev) => ({ ...prev, [key]: value }))
						}
						onCreateAccount={handleCreateAccount}
					/>
				</>
			);
		}
		if (activePage === "transactions") {
			return (
				<>
					{loadingTransactions && (
						<div className="p-4">Carregando transações...</div>
					)}
					<TransactionsPage
						transactions={transactions}
						page={transactionsPage}
						total={transactionsTotal}
						loading={loadingTransactions}
						error={errorTransactions}
						filters={transactionsFilters}
						accounts={accounts}
						onFiltersChange={(key, value) => {
							setTransactionsPage(1);
							setTransactionsFilters((prev) => ({ ...prev, [key]: value }));
						}}
						onPageChange={(nextPage) => {
							setTransactionsPage(nextPage);
						}}
						onTransferSuccess={() => {
							setTransactionsPage(1);
							setTransactionsFilters({
								startDate: "",
								endDate: "",
								typeTransaction: "",
							});
						}}
					/>
				</>
			);
		}
		if (activePage === "sales") {
			return <SalesPage />;
		}
		if (activePage === "sales") {
			return (
				<>
					{loadingSales && <div className="p-4">Carregando vendas...</div>}
					<SalesPage
						sales={sales}
						page={salesPage}
						total={salesTotal}
						loading={loadingSales}
						error={errorSales}
						filters={salesFilters}
						onFiltersChange={(key, value) => {
							setSalesPage(1);
							setSalesFilters((prev) => ({ ...prev, [key]: value }));
						}}
						onPageChange={(nextPage) => {
							setSalesPage(nextPage);
						}}
					/>
				</>
			);
		}
		if (activePage === "settings") {
			return (
				<section className="space-y-4">
					<div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
						Área de configurações (em construção).
					</div>
				</section>
			);
		}
		return <OverviewPage user={user} totals={totals} />;
	}

	return (
		<div className="flex min-h-screen bg-slate-100">
			<aside className="flex w-64 flex-col border-r border-slate-200 bg-slate-50 px-4 py-6">
				<div className="px-2">
					<h2 className="text-sm font-semibold tracking-[0.25em] text-slate-500">
						BANKING
					</h2>
					<p className="mt-1 text-lg font-bold text-slate-900">Meu Banco</p>
				</div>

				<nav className="mt-8 space-y-1 text-sm">
					<button
						type="button"
						className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left font-medium transition ${
							activePage === "dashboard"
								? "bg-orange-500/10 text-orange-600"
								: "text-slate-600 hover:bg-slate-100"
						}`}
						onClick={() => setActivePage("dashboard")}
					>
						<LayoutDashboard size={16} />
						<span>Dashboard</span>
					</button>
					<button
						type="button"
						className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left font-medium transition ${
							activePage === "account"
								? "bg-orange-500/10 text-orange-600"
								: "text-slate-600 hover:bg-slate-100"
						}`}
						onClick={() => setActivePage("account")}
					>
						<CreditCard size={16} />
						<span>Accounts</span>
					</button>
					<button
						type="button"
						className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left font-medium transition ${
							activePage === "sales"
								? "bg-orange-500/10 text-orange-600"
								: "text-slate-600 hover:bg-slate-100"
						}`}
						onClick={() => setActivePage("sales")}
					>
						<ShoppingCart size={16} />
						<span>Vendas</span>
					</button>
					<button
						type="button"
						className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left font-medium transition ${
							activePage === "transactions"
								? "bg-orange-500/10 text-orange-600"
								: "text-slate-600 hover:bg-slate-100"
						}`}
						onClick={() => setActivePage("transactions")}
					>
						<ArrowDownCircle size={16} />
						<span>Transações</span>
					</button>
					<button
						type="button"
						className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left font-medium transition ${
							activePage === "settings"
								? "bg-orange-500/10 text-orange-600"
								: "text-slate-600 hover:bg-slate-100"
						}`}
						onClick={() => setActivePage("settings")}
					>
						<Settings size={16} />
						<span>Configurações</span>
					</button>
				</nav>

				<div className="mt-auto pt-6">
					<Button
						variant="outline"
						className="w-full justify-center border-slate-300 text-xs font-medium text-slate-600"
						onClick={onLogout}
					>
						Sair
					</Button>
				</div>
			</aside>

			<div className="flex min-h-screen flex-1 flex-col bg-white">
				<header className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
					<div className="flex items-center gap-3 text-sm text-slate-500">
						<span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
							Dashboard
						</span>
						<span className="h-1 w-1 rounded-full bg-slate-300" />
						<span className="text-slate-700">Visão geral</span>
					</div>
					<div className="flex items-center gap-3">
						<div className="text-right">
							<p className="text-sm font-semibold text-slate-900">
								{user.email}
							</p>
							<p className="text-xs text-slate-500">Conta corporativa</p>
						</div>
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
							{userInitials}
						</div>
					</div>
				</header>

				<main className="flex-1 overflow-y-auto bg-slate-50 px-6 py-5">
					<div className="space-y-6">{renderPage()}</div>
				</main>
			</div>
		</div>
	);
}
