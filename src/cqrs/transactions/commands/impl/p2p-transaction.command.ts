

export class P2PTransactionCommand {
    constructor(
        public tenantId: string,
        public amount: number,
        public accountOriginId: string,
        public accountDestinationId: string
    ) {}
}