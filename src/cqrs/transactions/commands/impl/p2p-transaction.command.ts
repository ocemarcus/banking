

export class P2PTransactionCommand {
    constructor(
        public userId: string,
        public amount: number,
        public accountOriginId: string,
        public accountDestinationId: string
    ) {}
}