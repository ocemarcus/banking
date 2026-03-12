import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AccountRepository } from "@repository/account.repository";
import {
	TransactionsOwnerEntity,
	TransactionsRepository,
} from "@repository/transactions.repository";
import { generateId } from "@share/generate-id";
import { CreateTransactionsCommand } from "../impl/create-transactions.command";
import { DailyStatsTransactionsCommand } from "../impl/daily-stats-transactions.command";

@CommandHandler(CreateTransactionsCommand)
export class CreateTransactionsHandler
	implements ICommandHandler<CreateTransactionsCommand>
{
	constructor(
		private readonly transactionsRepository: TransactionsRepository,
		private readonly accountRepository: AccountRepository,
		private readonly command: CommandBus,
	) {}

	public async execute(command: CreateTransactionsCommand) {
		const { data } = command;
		const account = await this.accountRepository.findByAccountDetail({
			accountNumber: data.accountNumber,
		});
		if (!account?.id) {
			throw new HttpException("Conta não encontrada", HttpStatus.BAD_REQUEST);
		}

		if (data.amount < 0) {
			throw new HttpException(
				"Valor deve ser maior que 0",
				HttpStatus.BAD_REQUEST,
			);
		}

		const transactionOwnerId = await generateId();
		const transactionOwner: TransactionsOwnerEntity = {
			id: BigInt(transactionOwnerId),
			fullName: data.owner.fullName,
			cellPhone: data.owner.cellPhone,
			document: data.owner.document,
			bankName: data.owner.bankName,
			bankAccount: data.owner.bankAccount,
		};

		const debitId =
			await this.transactionsRepository.findOwnerOrSave(transactionOwner);

		const transactionId = await generateId();

		const transaction = {
			id: transactionId,

			amount: data.amount,

			typeTransaction: "pixIn",
			statusTransaction: "success",

			debitId,
			accountId: account.id,

			previousBalance: account.balance,
		} as any;

		const payload = {
			transaction,
			account: {
				accountId: account.id,
				version: +account.version,
			},
		};

		await this.transactionsRepository.save(payload);

		this.command.execute( new DailyStatsTransactionsCommand(
            data.amount,
			account.userId!.toString(),
            account.id.toString(),
            account.id.toString(),
            transaction.typeTransaction)
        );
	}
}
