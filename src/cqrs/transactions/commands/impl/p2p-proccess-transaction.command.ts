

export class P2PProcessTransactionCommand {
    constructor(
        public userId: string,
        public transaction: any,
        public accountOriginId: string,
        public accountDestinationId: string
    ) {}
}