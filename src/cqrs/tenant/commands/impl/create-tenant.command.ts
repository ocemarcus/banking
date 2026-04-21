

export class CreateTenantCommand  {
    constructor(
        public email: string,
        public fullName: string,
        public cellPhone: string,
        public document: string,
    ) {
    }
}