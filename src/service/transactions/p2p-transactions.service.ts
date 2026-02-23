import { P2PTransactionsDto } from "@controller/transactions/dto/p2p-transactions.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AccountRepository } from "@repository/account.repository";
import { TransactionsOwnerEntity, TransactionsRepository } from "@repository/transactions.repository";
import { uuidV7 } from "@share/uuidV7";

@Injectable()
export class P2PTransactionsService {
	constructor(
		private readonly transactionsRepository: TransactionsRepository,
		private readonly accountRepository: AccountRepository,
	) {}

	public async execute(data: P2PTransactionsDto, userId: string) {

		const account = await this.accountRepository.findByAccountDetail(
             {
                userId,
                id: data.accountId,
             }
		);

		if (!account?.id) {
            throw new HttpException('Conta não encontrada', HttpStatus.BAD_REQUEST)
		}

        if(data.amount < 0)  {
            throw new HttpException('Valor deve ser maior que 0', HttpStatus.BAD_REQUEST)
        }
        if(data.amount > +account.balance)  {
            throw new HttpException('Valor deve ser menor ou igual do saldo', HttpStatus.BAD_REQUEST)
        }

        const debitOwner: TransactionsOwnerEntity = {
            bankName: 'AC',
            id: await uuidV7(),
            fullName: account.user.fullName,
            cellPhone: account.user.cellPhone,
            document: account.user.document,
            bankAccount: account.accountNumber,
        }

        const debitId = await this.transactionsRepository.findOwnerOrSave(debitOwner)

        const accountFrom = await this.accountRepository.findByAccountDetail({id: data.accountFromId})

        if (!accountFrom?.id) {
            throw new HttpException('Conta não encontrada', HttpStatus.BAD_REQUEST)
        }

        const creditOwner: TransactionsOwnerEntity = {
            bankName: 'AC',
            id: await uuidV7(),
            document: accountFrom.user.document,
            fullName: accountFrom.user.fullName,
            cellPhone: accountFrom.user.cellPhone,
            bankAccount: accountFrom.accountNumber,
        }
        const creditId = await this.transactionsRepository.findOwnerOrSave(creditOwner)

		const transactions = 		[
			{
				id: await uuidV7(),

				accountId: account.id,
				previousBalance: account.balance,
				typeTransaction: "transferInternalOut",
			},
			{
				id: await uuidV7(),
                
				accountId: accountFrom.id,
				previousBalance: accountFrom.balance,
                typeTransaction: "transferInternalIn",

			},
		]as any

        const payload = {
        transactions: 
        transactions.map((item: any) => ({...item, 

				debitId,
                creditId,
				amount: data.amount,
				statusTransaction: "success",
        })), 
        account: {
            accountId: account.id,
            version: +account.version,
        },
        accountFrom: {
            accountId: accountFrom.id,
            version: +accountFrom.version,
         }
        }
        await this.transactionsRepository.saveP2P(payload)

	}
}
