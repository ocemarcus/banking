

export class P2PProcessTransactionCommand {
    constructor(
        public tenantId: string,
        public transaction: any,
        public accountOriginId: string,
        public accountDestinationId: string
    ) {}
}