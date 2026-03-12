import { CreateTransactionsDto } from "@cqrs/transactions/interfaces/dto/create-transactions.dto";


export class CreateTransactionsCommand {
    constructor(public data: CreateTransactionsDto) {}
}