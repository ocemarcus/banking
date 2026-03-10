import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AccountRepository } from "@repository/account.repository";
import { TransactionsRepository } from "@repository/transactions.repository";
import { uuidV7 } from "@share/uuidV7";
import moment from "moment";

@Injectable()
export class RollbackTransactionsService {
	constructor(
		private readonly transactionsRepository: TransactionsRepository,
		private readonly accountRepository: AccountRepository,
	) {}

	public async execute(transactionId: string, userId: string) {

        const transaction = await this.transactionsRepository.findRollbackDetail(transactionId, userId)

		if (!transaction?.typeTransaction) {
			throw new HttpException('Transação não encontrada', HttpStatus.BAD_REQUEST)
		}

		const validateTransaction = /Out/.test(transaction.typeTransaction)
		if(validateTransaction) {
			throw new HttpException('Tipo de transação inválida para rollback', HttpStatus.BAD_REQUEST)
		}


		if(transaction.statusTransaction !== 'success') {
			throw new HttpException('Staus da transação inválido', HttpStatus.BAD_REQUEST)
		}

        const rollback = {
			transactionId,
			amount: transaction.amount,
			accountId: transaction.account.id,
			accountBalance: transaction.account.balance,
			accountVersion: transaction.account.version,
		} as any

        await this.transactionsRepository.rollback(rollback)

		const account = await this.accountRepository.findByAccountDetail({ accountNumber: transaction.owner.bankAccount }) 
		if(!account?.id) {
			//Conta sem vículo com banking
			return
		}

		const newTransaction = {
            id: await uuidV7(),

			amount: transaction.amount,
			previousBalance: account.balance,
            statusTransaction: 'success',
			typeTransaction: transaction.typeTransaction,
			description: 'Extorno de transação',

            debitId: transaction.creditId,
			creditId: transaction.debitId,

            accountId: account.id,
        } as any

		const payload = {
			transaction: newTransaction, account: {
				accountId: account.id,
				version: +account.version,
			},
			transactionDate: moment().format('YYYY-MM-DD')
		} as any

		await this.transactionsRepository.save(payload)


	}
}