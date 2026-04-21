

export class UsersEntity {
    id: string

    tenantId: string

    email: string

    role: 'admin' | `member`

    fullName: string
    cellPhone: string
    document: string

    password: string
}