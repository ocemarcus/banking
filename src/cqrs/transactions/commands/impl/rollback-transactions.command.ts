


export class RollbackTransactionsCommand {
    constructor(
        public transactionId: string,
        public tenantId: string
    ) {}
}