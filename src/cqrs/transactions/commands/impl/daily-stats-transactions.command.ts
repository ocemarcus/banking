

export class DailyStatsTransactionsCommand {
    constructor(
        public amount: number,
        public accountOriginId: string,
        public accountDestinationId: string,
        public typeTransaction?: string,
        public transactionOriginId?: string
    ) {

    }
}