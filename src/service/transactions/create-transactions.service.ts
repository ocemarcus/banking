import { CreateTransactionsDto } from "@controller/transactions/dto/create-transactions.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AccountRepository } from "@repository/account.repository";
import { TransactionsOwnerEntity, TransactionsRepository } from "@repository/transactions.repository";
import { uuidV7 } from "@share/uuidV7";
import moment from "moment";

@Injectable()
export class CreateTransactionsService {
	constructor(
		private readonly transactionsRepository: TransactionsRepository,
		private readonly accountRepository: AccountRepository,
	) {}

	public async execute(data: CreateTransactionsDto) {

        const account = await this.accountRepository.findByAccountDetail({ accountNumber: data.accountNumber });
		if (!account?.id) {
            throw new HttpException('Conta não encontrada', HttpStatus.BAD_REQUEST)
		}

        if(data.amount < 0)  {
            throw new HttpException('Valor deve ser maior que 0', HttpStatus.BAD_REQUEST)
        }

        const transactionOwnerId = await uuidV7()
        const transactionOwner: TransactionsOwnerEntity = {
            id: BigInt(transactionOwnerId),
            fullName: data.owner.fullName,
            cellPhone: data.owner.cellPhone,
            document: data.owner.document,
            bankName: data.owner.bankName,
            bankAccount: data.owner.bankAccount,
        }

        const debitId = await this.transactionsRepository.findOwnerOrSave(transactionOwner)

		const transactionId = await uuidV7();

		const transaction = {
            id: transactionId,

            amount: data.amount,

            typeTransaction: 'pixIn',
            statusTransaction: 'success',

            debitId,
            accountId: account.id,

            previousBalance: account.balance,
        } as any


        const payload = {
            transaction,
            account: {
                accountId: account.id,
                version: +account.version,
            },
            transactionDate: moment().format('YYYY-MM-DD')
        }

        await this.transactionsRepository.save(payload)

	}
}
